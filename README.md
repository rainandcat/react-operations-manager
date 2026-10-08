# React Operations Manager

A public React portfolio project for operational workflows. It is a clean-room implementation that uses only locally authored mock data.

Current status: the customer directory now uses a fully local mock API with URL-backed search, status filtering, pagination, and loading/error/empty states. Demo sign-in and protected navigation are also available. Customer detail, activity records, dashboard data, and review mutations remain planned. See [Product spec](docs/PRODUCT_SPEC.md).

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

In Customers, search by fictional name or ID, filter by status, and change pages. The “Simulate service error” control demonstrates the error state. No real network request is sent by the mock service.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

No real API, account, transaction, or personal data is used or accepted by this project.
