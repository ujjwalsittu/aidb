extern crate diesel;

mod db;
mod schema;
mod compute;
mod pageserver_client;

use tonic::{transport::Server, Request, Response, Status};
use orchestrator::orchestrator_server::{Orchestrator, OrchestratorServer};
use orchestrator::*;
use tracing::info;
use chrono::Utc;
use db::{establish_connection, Workspace, Project};
use tonic_reflection::server::Builder as ReflectionBuilder;
use compute::set_pg_compute_replicas;
use pageserver_client::list_timelines;

// Move these use statements to the top
use pageserver::page_server_client::PageServerClient;
use pageserver::RestoreTimelineRequest;


pub mod orchestrator {
    tonic::include_proto!("orchestrator");
    pub const FILE_DESCRIPTOR_SET: &[u8] = include_bytes!("orchestrator_descriptor.bin");
}

pub mod pageserver {
    tonic::include_proto!("pageserver");
}

#[derive(Default)]
pub struct MyOrchestrator;

// Move the standalone function outside of the impl block
pub async fn restore_timeline_to_lsn(
    pageserver_addr: &str,
    base_timeline_id: &str,
    new_timeline_id: &str,
    target_lsn: u64,
) -> anyhow::Result<()> {
    let mut client = PageServerClient::connect(format!("http://{}", pageserver_addr)).await?;
    let req = RestoreTimelineRequest {
        base_timeline_id: base_timeline_id.to_string(),
        new_timeline_id: new_timeline_id.to_string(),
        target_lsn,
    };
    let resp = client.restore_timeline_to_lsn(req).await?.into_inner();
    if !resp.success {
        anyhow::bail!("Restore failed: {}", resp.error);
    }
    println!("Branch restored as {} at LSN {}", new_timeline_id, target_lsn);
    Ok(())
}

#[tonic::async_trait]
impl Orchestrator for MyOrchestrator {
    // == PROVISION A DATABASE ==
    async fn provision_database(
        &self,
        request: Request<ProvisionDatabaseRequest>
    ) -> Result<Response<ProvisionDatabaseResponse>, Status> {
        let req = request.into_inner();
        info!("ProvisionDatabase: {:?}", req);

        let mut conn = establish_connection();
        let ws_id = req.team_id;
        let proj_id = req.database_id;

        if let Err(msg) = db::check_plan_quota(&mut conn, &req.plan, &ws_id) {
            return Ok(Response::new(ProvisionDatabaseResponse{ success: false, error: msg }));
        }

        let ws_exists = db::workspace_exists(&mut conn, &ws_id);
        if !ws_exists {
            let ws = Workspace {
                id: ws_id.clone(),
                name: ws_id.clone(),
                plan_id: req.plan.clone(),
                created_at: Utc::now().naive_utc(),
            };
            db::insert_workspace(&mut conn, ws).map_err(|e| Status::internal(format!("{:?}", e)))?;
        }

        let pj = Project {
            id: proj_id.clone(),
            workspace_id: ws_id.clone(),
            db_version: req.postgres_version.clone(),
            status: "provisioning".to_string(),
            created_at: Utc::now().naive_utc(),
        };
        db::insert_project(&mut conn, pj).map_err(|e| Status::internal(format!("{:?}", e)))?;

        let compute_name = proj_id.clone();
        let workspace = ws_id.clone();
        let plan = req.plan;
        let pg_image = if req.postgres_version == "17" { "postgres:17" } else { "postgres:15" };
        
        // Generate or use a timeline_id - you can use the project_id as timeline_id
        let timeline_id = proj_id.clone();
        
        // Fixed: Added the missing timeline_id parameter (6th argument)
        if let Err(_e) = compute::deploy_pg_compute(&compute_name, pg_image, &workspace, &plan, &req.postgres_version, &timeline_id).await {
            return Ok(Response::new(ProvisionDatabaseResponse { success: false, error: format!("Failed K8s deploy: {:?}", _e) }));
        }

        Ok(Response::new(ProvisionDatabaseResponse { success: true, error: "".into() }))
    }

    async fn list_all_timelines(
        &self,
        _request: Request<ListAllTimelinesRequest>
    ) -> Result<Response<ListAllTimelinesResponse>, Status> {
        let pageserver_addr = "127.0.0.1:7867";
        let mut client = pageserver_client::pageserver::page_server_client::PageServerClient::connect(
            format!("http://{}", pageserver_addr)
        ).await.map_err(|e| Status::internal(format!("{:?}", e)))?;

        let response = client
            .list_timelines(pageserver_client::pageserver::ListTimelinesRequest {})
            .await
            .map_err(|e| Status::internal(format!("{:?}", e)))?
            .into_inner();

        Ok(Response::new(ListAllTimelinesResponse {
            timeline_ids: response.timeline_ids,
        }))
    }

    // == CREATE A BRANCH ==
    async fn create_branch(
        &self,
        request: Request<CreateBranchRequest>
    ) -> Result<Response<CreateBranchResponse>, Status> {
        let req = request.into_inner();
        info!("CreateBranch: {:?}", req);

        // 1. Insert a new project record (your DB logic here)
        let mut conn = establish_connection();
        let branch = Project {
            id: req.new_branch_id.clone(),
            workspace_id: req.source_db_id.clone(), // or lookup
            db_version: "branch".to_string(),
            status: "provisioning".to_string(),
            created_at: Utc::now().naive_utc(),
        };
        db::insert_project(&mut conn, branch).map_err(|e| Status::internal(format!("{:?}", e)))?;

        // 2. gRPC: Create timeline in the pageserver microservice
        let pageserver_addr = "127.0.0.1:7867";
        let resp = pageserver_client::create_timeline(
            pageserver_addr,
            Some(&req.source_db_id),
            None,
            &req.new_branch_id
        ).await.map_err(|e| Status::internal(format!("pageserver error: {:?}", e)))?;
        if !resp.success {
            return Err(Status::internal(format!("PageServer branch error: {}", resp.error)));
        }

        // 3. (optionally) Deploy compute node for this branch, as with provision_database() above

        Ok(Response::new(CreateBranchResponse { success: true, error: "".into() }))
    }

    async fn wake_up_compute(
        &self,
        request: Request<WakeUpComputeRequest>
    ) -> Result<Response<WakeUpComputeResponse>, Status> {
        let req = request.into_inner();
        info!("Wake up compute: {}", req.database_id);
        if let Err(_e) = set_pg_compute_replicas(&req.database_id, 1).await {
            return Ok(Response::new(WakeUpComputeResponse { success: false }));
        }
        Ok(Response::new(WakeUpComputeResponse { success: true }))
    }

    async fn get_status(
        &self,
        request: Request<GetStatusRequest>
    ) -> Result<Response<GetStatusResponse>, Status> {
        let req = request.into_inner();
        let mut conn = establish_connection();
        let projects = db::get_projects_by_workspace(&mut conn, &req.workspace_id);
        let pjson = serde_json::to_string(&projects).unwrap();
        Ok(Response::new(GetStatusResponse { status_json: pjson }))
    }

    async fn list_workspaces(
        &self,
        _request: Request<ListWorkspacesRequest>
    ) -> Result<Response<ListWorkspacesResponse>, Status> {
        let mut conn = establish_connection();
        let ids = db::list_workspace_ids(&mut conn);
        Ok(Response::new(ListWorkspacesResponse { workspace_ids: ids }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    let addr = "127.0.0.1:50051".parse()?;
    let orchestrator = MyOrchestrator::default();

    let reflection = ReflectionBuilder::configure()
        .register_encoded_file_descriptor_set(
            orchestrator::FILE_DESCRIPTOR_SET
        )
        .build()
        .unwrap();

    println!("AIDB Orchestrator gRPC starting on {}", addr);
    Server::builder()
        .add_service(OrchestratorServer::new(orchestrator))
        .add_service(reflection)
        .serve(addr)
        .await?;

    Ok(())
}