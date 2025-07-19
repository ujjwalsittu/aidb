# Production Launch Checklist (AIDB)

- [ ] Use strong, rotated keys/secrets for DB, JWT, storage, etc.
- [ ] Ensure `.env` and config values are not checked in
- [ ] Enable HTTPS on all endpoints and use HSTS policies
- [ ] Set up monitoring on latency, errors, backup jobs, and branch/PITR success
- [ ] Enable CORS whitelisting for APIs
- [ ] Schedule regular database and object storage backups (PITR tested!)
- [ ] Run vulnerability scans on containers/images
- [ ] Review audit events and security logs weekly

## Routine Security Tasks

- [ ] Rotate access keys at least quarterly or when staff devs change
- [ ] Sanitize logs, disable query logging of credentials/secrets
- [ ] Review all RBAC/team assignments
- [ ] Ensure billing webhooks (Stripe/Razorpay) have full signature verifications enabled

## For Contributors

- [ ] Run `pnpm run test` and lint before every PR
- [ ] Update affected documentation when changing endpoints or CLI flags

## Disaster Recovery

- [ ] Test restore for both full backup and point-in-time
- [ ] Off-site/replicated object storage with cross-region redundancy

For more, see [cloud-config.md](./cloud-config.md).
