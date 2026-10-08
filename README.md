# React Operations Manager

A public React portfolio project for operational workflows. It is a clean-room implementation that uses only locally authored mock data.

Current status: demo sign-in and protected navigation, customer and activity lists/details, a fictional dashboard snapshot, and a reviewer-only decision queue are available. Lists use URL-backed search, filters, sorting, and pagination. All data stays in a local mock API. See [Product spec](docs/PRODUCT_SPEC.md).

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

In Customers, search by fictional name or ID, filter, sort, and open a detail. Activities has independent filtering, sorting, and detail views. The “Simulate service error” controls demonstrate the error state. No real network request is sent by the mock service.

Dashboard links to fictional records. Reviewers can approve, request information, or reject a case after explicit confirmation. The review state resets on reload. Returning from a filtered list detail preserves the URL filters. No real network request is sent by the mock service.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

No real API, account, transaction, or personal data is used or accepted by this project.
