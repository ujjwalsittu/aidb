fn main() {
    tonic_build::configure()
        .compile(
            &["../proto/orchestrator.proto", "../proto/pageserver.proto"],
            &["../proto"],
        )
        .unwrap();
}
