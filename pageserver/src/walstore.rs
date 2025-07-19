use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::Client;
use anyhow::Result;

pub async fn upload_wal_chunk(
    s3: &Client,
    bucket: &str,
    timeline_id: &str,
    lsn: u64,
    data: &[u8],
) -> Result<()> {
    let key = format!("aidb-wal/{}/{}.wal", timeline_id, lsn);
    s3.put_object()
        .bucket(bucket)
        .key(&key)
        .body(ByteStream::from(data.to_vec()))
        .send()
        .await?;
    Ok(())
}

pub async fn list_wal_chunks(
    s3: &Client,
    bucket: &str,
    timeline_id: &str,
) -> Result<Vec<String>> {
    let prefix = format!("aidb-wal/{}/", timeline_id);
    let resp = s3
        .list_objects_v2()
        .bucket(bucket)
        .prefix(&prefix)
        .send()
        .await?;
    Ok(resp
        .contents
        .unwrap_or_default()
        .iter()
        .filter_map(|obj| obj.key.clone())
        .collect())
}
