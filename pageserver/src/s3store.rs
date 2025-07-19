use aws_sdk_s3::config::{Builder, Credentials, Region};
use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::Client;
use anyhow::Result;

pub struct S3Config {
    pub bucket: String,
    pub region: String,
    pub endpoint: Option<String>,
    pub access_key: String,
    pub secret_key: String,
}

impl S3Config {
    pub fn from_env() -> Self {
        use std::env;
        S3Config {
            bucket: env::var("AIDB_S3_BUCKET").unwrap_or_else(|_| "aidb".to_string()),
            region: env::var("AIDB_AWS_REGION").unwrap_or_else(|_| "us-east-1".to_string()),
            endpoint: env::var("AIDB_S3_ENDPOINT").ok(),
            access_key: env::var("AIDB_AWS_ACCESS_KEY").unwrap_or_else(|_| "admin".to_string()),
            secret_key: env::var("AIDB_AWS_SECRET").unwrap_or_else(|_| "adminadmin".to_string()),
        }
    }
}

pub async fn s3_client(cfg: &S3Config) -> Result<Client> {
    let mut builder = aws_sdk_s3::Config::builder()
        .region(Region::new(cfg.region.clone()))
        .credentials_provider(Credentials::new(
            cfg.access_key.clone(),
            cfg.secret_key.clone(),
            None,
            None,
            "aidb-dev",
        ))
        .behavior_version_latest();


    if let Some(endpoint) = &cfg.endpoint {
        builder = builder.endpoint_url(endpoint);
    }
    let config = builder.build();
    Ok(Client::from_conf(config))
}

pub async fn get_timeline(cfg: &S3Config, timeline_id: &str) -> Result<Vec<u8>> {
    let cli = s3_client(cfg).await?;
    let obj = cli
        .get_object()
        .bucket(&cfg.bucket)
        .key(format!("{}.bin", timeline_id))
        .send()
        .await;
    match obj {
        Ok(res) => {
            let data = res.body.collect().await?.into_bytes();
            Ok(data.to_vec())
        },
        Err(_) => Ok(vec![]) // Not found = empty
    }
}

pub async fn put_page(cfg: &S3Config, timeline_id: &str, data: &[u8]) -> Result<()> {
    let cli = s3_client(cfg).await?;
    cli.put_object()
        .bucket(&cfg.bucket)
        .key(format!("{}.bin", timeline_id))
        .body(ByteStream::from(data.to_vec()))
        .send()
        .await?;
    Ok(())
}
