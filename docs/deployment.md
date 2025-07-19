# AIDB Deployment Guide

## Architecture

- **Core backend:** stateless, runs in any Docker or container cloud environment
- **Metadata DB:** managed Postgres (or local Docker container in development)
- **Object storage:** S3, GCS, Azure, or Minio (local)
- **Frontends:** SPA bundles deployable to Vercel, Netlify, S3+Cloudfront, Azure Static, etc.

---

## Local (for Dev/Early Test)

1. Ensure Docker is running
   docker compose -f deploy/docker-compose.yml up -d

2. Bootstrap database schema (tables/models)
   pnpm run bootstrap # Will run DB migrations/seeders

3. Start core backend and frontends
   pnpm --filter aidb-core dev
   pnpm --filter aidb-admin dev

and so on

---

## Production: Docker Compose

1. Copy and edit `.env` for prod secrets
2. Launch:  
   docker compose -f deploy/docker-compose.yml up -d

3. Configure TLS/Proxy (e.g. Traefik, nginx in front)

---

## Kubernetes (recommended at scale)

- Use provided Helm chart or apply manifests in `deploy/k8s/`
- Use external persistent Postgres for metadata
- Cluster autoscaler: enable for scale-to-zero compute
- Secure secrets via Sealed Secrets, SOPS, or your vault
- Use K8s Jobs for PITR, WAL shipping, and branch restores

---

## Advanced:

- **Cloud endpoints:**  
  Deploy containers to AWS ECS, Azure Web Apps, GCP Cloud Run, Fly.io, or Render.com  
  Set all secrets as environment variables

- **CI/CD:**  
  Use GitHub Actions or your provider:

```name: Build and Deploy
on: [push]
jobs:
build:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
- uses: pnpm/action-setup@v3
- run: pnpm install && pnpm run build
- run: docker build -t ghcr.io/org/aidb-backend:${{ github.sha }} .
```

---

## Monitoring

- Metrics are emitted on OpenTelemetry and Prometheus (consult `.env` keys)
- View with Grafana dashboards or Datadog integration

---

## Compliance & Secrets

- All environment variables should be set via infrastructure secret managers for prod (never checked in)
- SOC2/ISO audit logs are in `audit_events` table; regular exports recommended

---

For full production checklist or deployment recipes, see `/docs/ops-checklist.md`.
