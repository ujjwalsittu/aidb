pub mod pageserver {
    tonic::include_proto!("pageserver");
}
use pageserver::page_server_client::PageServerClient;
use pageserver::{CreateTimelineRequest, CreateTimelineResponse};

pub async fn create_timeline(
    pageserver_addr: &str,
    new_timeline_id: &str,
    base_timeline_id: Option<&str>,
    fork_lsn: Option<u64>,
) -> anyhow::Result<CreateTimelineResponse> {
    let mut client = PageServerClient::connect(format!("http://{}", pageserver_addr)).await?;
    let req = CreateTimelineRequest {
        base_timeline_id: base_timeline_id.unwrap_or_default().to_string(),
        fork_lsn: fork_lsn.unwrap_or(0),
        new_timeline_id: new_timeline_id.to_string(),
    };
    let resp = client.create_timeline(req).await?.into_inner();
    Ok(resp)
}
