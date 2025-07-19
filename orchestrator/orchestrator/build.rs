fn main() {
    tonic_build::compiler()
        .compile(
            &["../proto/orchestrator.proto", "../proto/pageserver.proto"],
            &["../proto"],
        )
        .unwrap();
}
