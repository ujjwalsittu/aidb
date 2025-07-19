# AIDB — The World’s Most Flexible Serverless Postgres DBaaS

AIDB delivers instant, branchable, serverless PostgreSQL for production and AI—**multi-cloud**, **open source**, **blazingly fast**, and **developer-first**.

## Key Features

- **Branching/Forking:** create isolated DB branches instantly (copy-on-write)
- **PITR:** point-in-time recovery (restore/query to any timestamp or LSN)
- **Multi-cloud:** deploy anywhere and store data on S3, GCS, Azure, or Minio
- **Autoscale & Scale-to-zero:** pay only for usage, spins up in sub-second on demand
- **Vector/AI Ready:** built-in `pgvector` for fast embeddings & LLM apps
- **CLI/SDK/REST/WebSocket:** fully scriptable platform
- **RBAC, Teams, Usage Metering**, SOC2 & GDPR-ready
- **Billing:** Stripe & Razorpay integration for global coverage
- **Self-hostable:** Apache 2.0 license, run your own cluster on any cloud

## Quickstart

Prereqs: Node.js 18+, Docker, pnpm (recommended)
git clone https://github.com/aidb/aidb.git
cd aidb

Copy env example and set your secrets
cp .env.example .env

# Edit .env (see docs/cloud-config.md for cloud setup)

Start essential services, core DB, and object storage
docker compose -f deploy/docker-compose.yml up -d

Install all dependencies
pnpm install

Bootstrap databases (run once)
pnpm run bootstrap

Start backend APIs (dev mode)
cd apps/core
pnpm run dev

Start admin panel (in new terminal)
cd ../../apps/admin
pnpm run dev

Start customer portal (optional)
cd ../customer
pnpm run dev

...repeat for support, landing, etc.
text

## CLI Example

npx aidb login
npx aidb db provision --name mydb
npx aidb branch create --from mydb --name "migration-preview"
npx aidb pitr restore --db mydb --timestamp "2024-06-09T15:31:00Z"

text

## Deploying in Production

1. Set all secrets in `.env` files
2. Connect your S3/GCS/Azure storage (see [docs/cloud-config.md](./docs/cloud-config.md))
3. Deploy via Kubernetes, Docker Compose, or your preferred orchestrator
4. Monitor via included observability endpoints/Grafana/Prometheus
5. Integrate with Stripe/Razorpay for paid plans (production API keys)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute or build a new extension.
See [SECURITY.md](./SECURITY.md) for disclosure and security checking guidelines.

## License

Apache License 2.0 — See [LICENSE](./LICENSE) file.
