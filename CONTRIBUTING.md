# Contributing to AIDB

Thank you for your interest in contributing!

## How to Contribute

1. **Open an issue** or search existing before submitting a PR.
2. **Fork** the project and branch off from latest `main`.
3. **Work in the right package/app:**
   - `apps/core` — core backend/platform
   - `apps/admin` — admin SPA
   - `apps/customer` — customer UI
   - `apps/support` — support/internal tools
   - `apps/toolkit` — Node.js CLI + SDK
4. **Run tests** before submitting
5. **Sign PRs** with clear summaries and link to issues whenever possible.

## Style Guide

- Use TypeScript, format with Prettier, lint with `eslint`
- For React: function components + hooks, MUI v5 for design system
- Place secrets/keys only in `.env.local`
- Use `pnpm` in monorepo; scripts are cross-app
- Document all exported functions/classes; use JSDoc

## Code of Conduct

All contributors must abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Reporting Security Issues

Please see [SECURITY.md](./SECURITY.md) and **do not file GitHub issues for vulnerabilities**.

Happy building!
