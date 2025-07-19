fn main() {
    tonic_build::configure()
        .file_descriptor_set_path("src/orchestrator_descriptor.bin")
        .compile(&["../proto/orchestrator.proto"], &["../proto"])
        .unwrap();
}
