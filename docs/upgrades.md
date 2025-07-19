# Upgrade & Migration Guide

- Use the included DB migration tool in `/scripts/migrate.ts`
- Track your schema revisions via git
- Major upgrades/change logs are recorded in `CHANGELOG.md`

When planning core DB schema, always use SQL files under `/deploy/migrations/`

7️⃣ GLOSSARY

**Branch**: a full copy-on-write database branch, can merge/fork or diff
**PITR**: Point-in-time recovery, can restore or query as-of a prior timestamp
**Replica**: Read-only instance for scaling reads
**Team**: Isolated unit/project—each team has own DBs, billing, users
**Vector**: Embedding data type for AI/LLM search, powered by pgvector
**WAL**: Write-ahead-log used for replication and PITR
