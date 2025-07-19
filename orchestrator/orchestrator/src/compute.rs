use kube::{Client, api::{Api, PostParams, Patch, PatchParams}};
use k8s_openapi::api::apps::v1::Deployment;
use k8s_openapi::api::core::v1::{
    Container, PodSpec, PodTemplateSpec, EnvVar, EnvVarSource, SecretKeySelector, Secret,
};
use k8s_openapi::apimachinery::pkg::apis::meta::v1::{ObjectMeta, LabelSelector};
use k8s_openapi::ByteString;
use std::collections::BTreeMap;
use serde_json::json;
use rand::{distributions::Alphanumeric, Rng};

/// ----------- ENV/SECRET HELPERS ------------

fn env(name: &str, value: &str) -> EnvVar {
    EnvVar {
        name: name.to_string(),
        value: Some(value.to_string()),
        value_from: None,
    }
}

fn env_from_secret(env_name: &str, secret_name: &str, key: &str) -> EnvVar {
    EnvVar {
        name: env_name.to_string(),
        value: None,
        value_from: Some(EnvVarSource {
            secret_key_ref: Some(SecretKeySelector {
                name: Some(secret_name.to_string()),
                key: key.to_string(),
                optional: Some(false),
            }),
            ..Default::default()
        }),
    }
}

/// Generate a random password for the DB
fn random_pw() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(20)
        .map(char::from)
        .collect()
}

/// Create or update a K8s Secret for a DB's credentials
pub async fn ensure_db_secret(
    name: &str,
    workspace_id: &str,
    db_user: &str,
    db_pass: &str,
) -> anyhow::Result<()> {
    let client = Client::try_default().await?;
    let secrets: Api<Secret> = Api::namespaced(client, "default");
    let secret_name = format!("aidb-cred-{}", name);

    let mut data = BTreeMap::new();
    data.insert(
        "POSTGRES_USER".to_string(),
        ByteString(db_user.as_bytes().to_vec()),
    );
    data.insert(
        "POSTGRES_PASSWORD".to_string(),
        ByteString(db_pass.as_bytes().to_vec()),
    );

    let secret = Secret {
        metadata: ObjectMeta {
            name: Some(secret_name.clone()),
            labels: Some(
                [("aidb-workspace".to_string(), workspace_id.to_string())]
                    .iter()
                    .cloned()
                    .collect(),
            ),
            ..Default::default()
        },
        data: Some(data),
        type_: Some("Opaque".to_string()),
        ..Default::default()
    };

    match secrets.create(&PostParams::default(), &secret).await {
        Ok(_) => Ok(()),
        Err(e) => {
            if e.to_string().contains("AlreadyExists") {
                secrets
                    .replace(&secret_name, &PostParams::default(), &secret)
                    .await?;
                Ok(())
            } else {
                Err(anyhow::anyhow!("K8s secret error: {:?}", e))
            }
        }
    }
}

/// -------------- CORE DEPLOY FUNCTION ------------------

pub async fn deploy_pg_compute(
    name: &str,
    image: &str,
    workspace_id: &str,
    plan: &str,
    db_version: &str,
) -> anyhow::Result<()> {
    let client = Client::try_default().await?;
    let deployments: Api<Deployment> = Api::namespaced(client, "default");
    let deploy_name = format!("aidb-pg-{}", name);

    let mut labels: BTreeMap<String, String> = BTreeMap::new();
    labels.insert("aidb-workspace".to_string(), workspace_id.to_string());
    labels.insert("aidb-plan".to_string(), plan.to_string());
    labels.insert("pg-version".to_string(), db_version.to_string());

    let db_name = name;
    let db_user = "aidbuser";
    let db_pass = &random_pw();

    // Create or update the K8s Secret
    ensure_db_secret(db_name, workspace_id, db_user, db_pass).await?;

    // Build ENV injected from the secret and static config
    let env_vars = vec![
        env_from_secret(
            "POSTGRES_USER",
            &format!("aidb-cred-{}", db_name),
            "POSTGRES_USER",
        ),
        env_from_secret(
            "POSTGRES_PASSWORD",
            &format!("aidb-cred-{}", db_name),
            "POSTGRES_PASSWORD",
        ),
        env("PAGESERVER_ENDPOINT", "http://pageserver.default.svc.cluster.local:7676"),
        env("PROXY_ENDPOINT", "http://proxy.default.svc.cluster.local:6432"),
    ];

    let deployment = Deployment {
        metadata: ObjectMeta {
            name: Some(deploy_name.clone()),
            labels: Some(labels.clone()),
            ..Default::default()
        },
        spec: Some(k8s_openapi::api::apps::v1::DeploymentSpec {
            replicas: Some(0), // scale to zero on launch
            selector: LabelSelector {
                match_labels: Some(
                    [("aidb-workspace".to_string(), workspace_id.to_string())]
                        .iter()
                        .cloned()
                        .collect(),
                ),
                ..Default::default()
            },
            template: PodTemplateSpec {
                metadata: Some(ObjectMeta {
                    labels: Some(labels),
                    ..Default::default()
                }),
                spec: Some(PodSpec {
                    containers: vec![Container {
                        name: "postgres".to_string(),
                        image: Some(image.to_string()),
                        env: Some(env_vars),
                        ..Default::default()
                    }],
                    ..Default::default()
                }),
            },
            ..Default::default()
        }),
        ..Default::default()
    };

    deployments.create(&PostParams::default(), &deployment).await?;
    Ok(())
}

/// Scale compute node deployment up/down
pub async fn set_pg_compute_replicas(name: &str, replicas: i32) -> anyhow::Result<()> {
    let client = Client::try_default().await?;
    let deployments: Api<Deployment> = Api::namespaced(client, "default");
    let deploy_name = format!("aidb-pg-{}", name);

    let patch = json!({ "spec": { "replicas": replicas } });
    deployments
        .patch(
            &deploy_name,
            &PatchParams::apply("aidb-orchestrator"),
            &Patch::Merge(&patch),
        )
        .await?;
    Ok(())
}
