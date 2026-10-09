# React Operations Manager

A public React portfolio project for operational workflows. It is a clean-room implementation that uses only locally authored mock data.

Current status: demo sign-in and protected navigation, customer and activity lists/details, a fictional dashboard snapshot, and a reviewer-only decision queue are available. Lists use URL-backed search, filters, sorting, and pagination. All data stays in a local mock API. See [Product spec](docs/PRODUCT_SPEC.md).

## Implemented scope

- Dashboard and operational summaries
- Customer directory and activity records
- Review queue with simulated mutations
- Protected routes, reviewer-only route, and mock session handling

## Local development

```bash
npm ci
npm run dev
```

Open the local URL shown by Vite. Demo accounts: `reviewer@demo.invalid` (review queue access) or `operator@demo.invalid` (browse only). Both use passcode `demo123`. These are public demo strings, not real credentials. The session is stored only in browser session storage.

In Customers, search by fictional name or ID, filter, sort, and open a detail. Activities has independent filtering, sorting, and detail views. The “Simulate service error” controls demonstrate the error state. No real network request is sent by the mock service.

Dashboard links to fictional records. Reviewers can approve, request information, or reject a case after explicit confirmation. The review state resets on reload. Returning from a filtered list detail preserves the URL filters. No real network request is sent by the mock service.

## Quality checks

Unexpected route/render failures show a safe recovery screen instead of a blank page. The demo does not expose internal error details or send them to an external service.

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

## Browser verification

Local verification (2026-10-09): 37 Vitest tests and 6 Chromium E2E cases passed.
The browser cases cover three journeys at two viewport sizes; they are not six distinct workflows.
Type checking, lint, formatting and production build are also checked.

Use Node.js 22.14 or newer in the Node 22 line. Install Chromium once, then run:

```bash
npx playwright install chromium
npm run test:e2e
```

The script builds the production bundle; Playwright setup starts and closes an in-process preview server on port 4173.
Three journeys run at desktop (1440 × 1000) and mobile (390 × 844) sizes.
Each test gets a fresh browser context. Vitest only collects tests under `src/`.
Failure traces and the HTML report stay in ignored `test-results/` and `playwright-report/` directories.
The GitHub workflow runs unit/component checks and Chromium journeys; remote CI status must be checked after pushing.

## Preview

![Operational dashboard on desktop](docs/screenshots/desktop.png)

<img src="docs/screenshots/mobile.png" width="390" alt="Operational dashboard on a narrow mobile viewport" />

These screenshots use fictional data. Regenerate them from the review confirmation browser journey after UI changes; its output includes `overview.png` for each viewport.

## Architecture and decisions

```mermaid
flowchart LR
  URL[Router and URL filters] --> UI[Feature pages]
  UI --> Query[TanStack Query]
  Query --> API[Typed local mock services]
  Store[Zustand session] --> UI
```

- The URL owns list filters, sorting and pagination. Details preserve the originating list query through router history state.
- TanStack Query owns request data and cache; Zustand owns browser session. Query results are not copied into Zustand.
- Mock reads accept `AbortSignal`; cleanup cancels pending timers. Retry policy distinguishes retryable service errors from missing records.
- Review mutations invalidate the review queue and dashboard. The mock service rejects already-decided cases to prevent duplicate changes.
- Out-of-range pages are corrected without removing filters. Unexpected rendering failures expose recovery controls.

## Two-minute walkthrough

1. Sign in as reviewer and open a filtered customer list. Open a detail and return with the filters intact.
2. Open Review queue, simulate a decision failure, then retry successfully. Return to Overview to see the pending count update.
3. Sign out and sign in as operator. Opening Review queue shows the access-denied page.

## Limits and next steps

This is a frontend demonstration. Route guards are not server authorization, and mock data is not shared between repositories.
Review decisions reset on full reload. There is no real review backend.
No live connection, token refresh, performance benchmark, or public deployment is claimed.
Mobile verification uses a Chromium viewport, not a physical device or Safari.
Static hosting must rewrite application routes to `index.html` so direct links and refreshes work.
The local preview is available with `npm run build` followed by `npm run preview`.

No real API, account, transaction, or personal data is used or accepted by this project.
