# React Operations Manager

A public React portfolio project for operational workflows. It is a clean-room implementation that uses only locally authored mock data.

Current status: M1 navigation, responsive layout, and local demo sign-in are implemented. Dashboard and data pages are navigation shells; mock API behavior arrives in M2. See [Product spec](docs/PRODUCT_SPEC.md).

## Planned scope

- Dashboard and operational summaries
- Customer directory and activity records
- Review queue with simulated mutations
- Protected routes, reviewer-only route, and mock session handling

## Local development

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Demo accounts: `reviewer@demo.invalid` (review queue access) or `operator@demo.invalid` (browse only). Both use passcode `demo123`. These are public demo strings, not real credentials. The session is stored only in browser session storage.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

No real API, account, transaction, or personal data is used or accepted by this project.
