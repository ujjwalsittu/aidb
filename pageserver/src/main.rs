pub mod pageserver {
    tonic::include_proto!("pageserver");
}
mod s3store;
use s3store::*;
use std::env;
mod storage;
use pageserver::page_server_server::{PageServer, PageServerServer};
use pageserver::*;
use tonic::{transport::Server, Request, Response, Status};
use tracing::{info};
use uuid::Uuid;

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
        let data = get_timeline(&cfg, &req.timeline_id).await.unwrap_or_default();
        let error = if data.is_empty() { "Page not found".to_string() } else { "".to_string() };
        Ok(Response::new(GetPageResponse {
            page_data: data,
            error,
        }))
    }

    async fn create_timeline(
        &self,
        request: Request<CreateTimelineRequest>,
    ) -> Result<Response<CreateTimelineResponse>, Status> {
        let req = request.into_inner();
        let cfg = S3Config::from_env();
        put_page(&cfg, &req.new_timeline_id, b"").await.map_err(|e| Status::internal(format!("failed to create: {e:?}")))?;
        Ok(Response::new(CreateTimelineResponse {
            success: true,
            error: "".to_string(),
        }))
    }

    async fn list_timelines(
        &self,
        _request: Request<ListTimelinesRequest>,
    ) -> Result<Response<ListTimelinesResponse>, Status> {
        let timelines = storage::list_timelines();
        Ok(Response::new(ListTimelinesResponse {
            timeline_ids: timelines,
        }))
    }

    async fn gc_unused_data(
        &self,
        _request: Request<GcUnusedDataRequest>,
    ) -> Result<Response<GcUnusedDataResponse>, Status> {
        // For demo: No GC.
        Ok(Response::new(GcUnusedDataResponse {
            success: true,
            error: "".to_string(),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    let addr = "127.0.0.1:7867".parse()?;
    println!("AIDB PageServer gRPC running at {}", addr);

    let ps = MyPageServer::default();

    Server::builder()
        .add_service(PageServerServer::new(ps))
        .serve(addr)
        .await?;

    Ok(())
}
