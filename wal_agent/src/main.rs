pub mod pageserver {
    tonic::include_proto!("pageserver");
}
use pageserver::page_server_client::PageServerClient;
use pageserver::UploadWalChunkRequest;
use notify::{RecommendedWatcher, RecursiveMode, Watcher, EventKind};
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use clap::Parser;
use std::sync::mpsc::channel;
use dotenvy::dotenv;
use anyhow::Result;

#[derive(Parser, Debug)]
struct Args {
    #[arg(long, default_value = "/var/lib/postgresql/data/pg_wal")]
    watch_dir: String,
    #[arg(long, env = "AIDB_TIMELINE_ID")]
    timeline_id: String,
    #[arg(long, env = "PAGESERVER_ENDPOINT", default_value = "127.0.0.1:7867")]
    pageserver_endpoint: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let args = Args::parse();

    println!("Watching WAL dir: {}", args.watch_dir);
    println!("Timeline: {}", args.timeline_id);
    println!("PageServer: {}", args.pageserver_endpoint);

    let (tx, rx) = channel();
    let mut watcher: RecommendedWatcher = Watcher::new(tx, notify::Config::default())?;
    watcher.watch(args.watch_dir.as_ref(), RecursiveMode::NonRecursive)?;

    loop {
        match rx.recv() {
            Ok(event_result) => {
                match event_result {
                    Ok(event) => {
                        // Now event is notify::Event
                        if let EventKind::Create(_) = event.kind {
                            for path in &event.paths {
                                if path.is_file() {
                                    let fname = path.file_name().unwrap().to_string_lossy().to_string();
                                    let lsn = parse_lsn_from_wal_filename(&fname).unwrap_or(0);
                                    let mut f = File::open(&path).await?;
                                    let mut data = Vec::new();
                                    f.read_to_end(&mut data).await?;
                                    let mut client = PageServerClient::connect(
                                        format!("http://{}", args.pageserver_endpoint)
                                    ).await?;
                                    let req = UploadWalChunkRequest {
                                        timeline_id: args.timeline_id.clone(),
                                        lsn,
                                        data,
                                    };
                                    let _resp = client.upload_wal_chunk(req).await?;
                                    println!("Uploaded WAL chunk {} (lsn {}) to pageserver! Deleting from disk...", fname, lsn);
                                    if let Err(e) = tokio::fs::remove_file(&path).await {
                                        eprintln!("Warning: failed to delete {}: {:?}", fname, e);
                                    }
                                }
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("File watch event error: {:?}", e);
                    }
                }
            }
            Err(e) => {
                eprintln!("Watch receiver error: {:?}", e);
            }
        }
    }

   }

fn parse_lsn_from_wal_filename(fname: &str) -> Option<u64> {
    u64::from_str_radix(fname.trim_matches('.'), 16).ok()
}
