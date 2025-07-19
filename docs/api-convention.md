# API Conventions

- REST, resource-oriented URLs: `/api/db`, `/api/teams`, `/api/billing`
- Always require Bearer JWT (except `/health`, `/auth/login`)
- All endpoints return JSON: `{ success: boolean, ... }` or `{ error: "message" }`
- All times in ISO8601 UTC
- Clearly distinguish per-team, per-user, and admin (global) endpoints
- Document new endpoints in this file

## Error handling

- Use appropriate HTTP codes: 400, 401, 403, 409, 500
- Message bodies should not leak sensitive info.

## Versioning

- All production APIs are versioned at `/api/v1/...` in major releases.

For major changes, open an issue with API contract proposal first!
