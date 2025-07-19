use std::env;
use std::fs::{self, OpenOptions};
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};

/// Where all timelines are stored (relative to project root)
pub const TIMELINE_DATA_DIR: &str = "data";

/// Get the file path for a given timeline
pub fn timeline_file(timeline_id: &str) -> PathBuf {
    let path = Path::new(TIMELINE_DATA_DIR).join(format!("{}.bin", timeline_id));
    // Auto-create the data/ dir if not present
    if !path.parent().unwrap().exists() {
        fs::create_dir_all(path.parent().unwrap()).expect("create data dir");
    }
    path
}

/// Read a "page" for this example (just the whole file, or empty)
pub fn read_page(timeline_id: &str, _lsn: u64, _rel: &[u8]) -> Vec<u8> {
    let path = timeline_file(timeline_id);
    if !path.exists() {
        vec![]
    } else {
        let mut f = std::fs::File::open(path).unwrap();
        let mut buf = vec![];
        f.read_to_end(&mut buf).unwrap();
        buf
    }
}

/// Write page(s) (append to the timeline file for very simple storage)
pub fn write_page(timeline_id: &str, data: &[u8]) {
    let path = timeline_file(timeline_id);
    let mut f = OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .unwrap();
    f.write_all(data).unwrap();
}

/// List all stored timelines
pub fn list_timelines() -> Vec<String> {
    let mut timelines = vec![];
    let dir = Path::new(TIMELINE_DATA_DIR);
    if dir.exists() {
        for entry in fs::read_dir(dir).unwrap() {
            let entry = entry.unwrap();
            let fname = entry.file_name();
            let s = fname.to_string_lossy();
            if s.ends_with(".bin") {
                timelines.push(s.trim_end_matches(".bin").to_string());
            }
        }
    }
    timelines
}
