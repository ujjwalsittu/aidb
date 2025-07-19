pub mod pageserver {
    tonic::include_proto!("pageserver");
}
use pageserver::page_server_client::PageServerClient;
use pageserver::{CreateTimelineRequest, CreateTimelineResponse};
use pageserver::{ListTimelinesRequest, ListTimelinesResponse, page_server_client::PageServerClient};
use pageserver::{RestoreTimelineRequest, RestoreTimelineResponse, page_server_client::PageServerClient};

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

pub async fn list_timelines(
    pageserver_addr: &str,
) -> anyhow::Result<Vec<String>> {
    let mut client = PageServerClient::connect(format!("http://{}", pageserver_addr)).await?;
    let resp = client
        .list_timelines(ListTimelinesRequest {})
        .await?
        .into_inner();
    Ok(resp.timeline_ids)
}

pub async fn create_timeline(
    pageserver_addr: &str,
    base_timeline_id: Option<&str>,
    fork_lsn: Option<u64>,
    new_timeline_id: &str,
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
