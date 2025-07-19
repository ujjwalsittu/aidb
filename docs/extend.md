# Extending AIDB (SDK/CLI, Plugins, Automation)

- **CLI (`apps/toolkit`):**  
  Add a new command? Write a new file in `src/commands`, export a `Command`, and import it in `index.ts`

  - Example: Add `teams.ts` for team CLI ops

- **SDK (Node.js/TypeScript):**  
  Add wrappers for more API endpoints in `src/api.ts`. Export instance for use in Node scripts.

- **Export/Import/Backup Integration:**  
  To extend snapshot or PITR logic, see `/src/services/StorageManager.ts` in the backend.

- **Add a vector search format?**  
  Implement a service in `/src/services/VectorService.ts` using the pgvector APIs.

- **New frontend admin/dashboard widget?**  
  Place a new component/page in `apps/admin/src/pages` and route in `App.tsx`.

All contributions must pass tests and linter before PR is reviewed!
