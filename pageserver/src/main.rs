// src/main.rs

pub mod pageserver {
    tonic::include_proto!("pageserver");
}
mod s3store;
use pageserver::page_server_server::{PageServer, PageServerServer};
use pageserver::*;
use pageserver::{RestoreTimelineRequest, RestoreTimelineResponse};
use s3store::*;
use tonic::{transport::Server, Request, Response, Status};
use tracing::info;

#[derive(Default)]
pub struct MyPageServer;

#[tonic::async_trait]
impl PageServer for MyPageServer {
    async fn get_page(
        &self,
        request: Request<GetPageRequest>,
    ) -> Result<Response<GetPageResponse>, Status> {
        let req = request.into_inner();
        let cfg = S3Config::from_env();
        let data = get_timeline(&cfg, &req.timeline_id)
            .await
            .unwrap_or_default();
        let error = if data.is_empty() {
            "Page not found".to_string()
        } else {
            "".to_string()
        };
        Ok(Response::new(GetPageResponse {
            page_data: data,
            error,
        }))
    }

    async fn upload_wal_chunk(
        &self,
        request: Request<UploadWalChunkRequest>,
    ) -> Result<Response<UploadWalChunkResponse>, Status> {
        let req = request.into_inner();
        let cfg = S3Config::from_env();
        let s3 = s3_client(&cfg)
            .await
            .map_err(|e| Status::internal(format!("{e:?}")))?;
        match upload_wal_chunk(&s3, &cfg.bucket, &req.timeline_id, req.lsn, &req.data).await {
            Ok(_) => Ok(Response::new(UploadWalChunkResponse {
                success: true,
                error: "".into(),
            })),
            Err(e) => Ok(Response::new(UploadWalChunkResponse {
                success: false,
                error: format!("{e:?}"),
            })),
        }
    }

    async fn create_timeline(
        &self,
        request: Request<CreateTimelineRequest>,
    ) -> Result<Response<CreateTimelineResponse>, Status> {
        let req = request.into_inner();
        let cfg = S3Config::from_env();
        put_page(&cfg, &req.new_timeline_id, b"")
            .await
            .map_err(|e| Status::internal(format!("failed to create: {e:?}")))?;
        Ok(Response::new(CreateTimelineResponse {
            success: true,
            error: "".to_string(),
        }))
    }

    async fn restore_timeline_to_lsn(
        &self,
        request: Request<RestoreTimelineRequest>,
    ) -> Result<Response<RestoreTimelineResponse>, Status> {
        let req = request.into_inner();
        // TODO: Add restore/replay logic here.
        // Right now: just create the branch timeline as an empty object for demo/dev.
        let cfg = S3Config::from_env();
        let _ = put_page(&cfg, &req.new_timeline_id, b"").await;
        Ok(Response::new(RestoreTimelineResponse {
            success: true,
            error: "".to_string(),
        }))
    }

    async fn list_timelines(
        &self,
        _request: Request<ListTimelinesRequest>,
    ) -> Result<Response<ListTimelinesResponse>, Status> {
        let cfg = S3Config::from_env();
        let timelines = list_timelines_s3(&cfg).await.unwrap_or_default();
        Ok(Response::new(ListTimelinesResponse {
            timeline_ids: timelines,
        }))
    }

    async fn gc_unused_data(
        &self,
        _request: Request<GcUnusedDataRequest>,
    ) -> Result<Response<GcUnusedDataResponse>, Status> {
        Ok(Response::new(GcUnusedDataResponse {
            success: true,
            error: "".to_string(),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load the project's .env (if present) and all global env variables!
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();
    let addr = "127.0.0.1:7867".parse()?;

    // Print config at startup (for sanity)
    println!(
        "AIDB pageserver config: bucket={} region={} endpoint={} access_key={}",
        std::env::var("AIDB_S3_BUCKET").unwrap_or_default(),
        std::env::var("AIDB_AWS_REGION").unwrap_or_default(),
        std::env::var("AIDB_S3_ENDPOINT").unwrap_or_default(),
        std::env::var("AIDB_AWS_ACCESS_KEY").unwrap_or_default()
    );
    println!("AIDB PageServer gRPC running at {}", addr);

    let ps = MyPageServer::default();

    Server::builder()
        .add_service(PageServerServer::new(ps))
        .serve(addr)
        .await?;

    Ok(())
}
