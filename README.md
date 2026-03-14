# Expense Tracker

A personal income and expense tracker built with SvelteKit.

The app is designed to feel lightweight and calm:

- clean home screen
- quick add flows for expense and income
- local storage with Dexie/IndexedDB plus Firebase sync
- searchable transactions and filters
- recurring transaction support
- desktop and mobile-specific navigation patterns

## Current State

This repository currently contains a working frontend application with local persistence and Firebase-backed authentication/sync.

Implemented:

- Home dashboard with:
  - current balance
  - income this month
  - expense this month
  - add expense action
  - add income action
- Dedicated add pages:
  - `/add-expense`
  - `/add-income`
- Transactions explorer with:
  - search
  - month filter
  - category filter
  - payment method filter
  - date range filter
  - transaction detail page
  - edit and soft delete
- Searchable category combobox for forms
- Recurring transactions UI, generation, and pause/resume controls
- Editable income and expense categories
- Insights page
- Settings page with:
  - theme selection
  - sync status
  - CSV export
  - links to recurring and categories
- PWA manifest/service worker integration
- Vercel deployment adapter

Not fully implemented yet:

- production-grade conflict resolution beyond last-write-wins
- real-time listeners for cloud updates
- synced settings/preferences

## Tech Stack

- SvelteKit
- Svelte 5
- TypeScript
- Tailwind CSS v4
- Bits UI
- Dexie
- Firebase SDK
- `vite-plugin-pwa`
- Vercel adapter for SvelteKit

## Project Structure

```text
src/
  lib/
    components/
      ui/
    db/
    services/
    stores/
    utils/
  routes/
    dashboard/
    transactions/
    insights/
    recurring/
    categories/
    settings/
    add-expense/
    add-income/
  pwa/
```

Key files:

- [`src/routes/+layout.svelte`](src/routes/+layout.svelte): app shell, desktop/mobile navigation
- [`src/routes/dashboard/+page.svelte`](src/routes/dashboard/+page.svelte): home screen
- [`src/lib/db/dexie.ts`](src/lib/db/dexie.ts): Dexie database setup
- [`src/lib/features/transactions/store/transactionStore.ts`](src/lib/features/transactions/store/transactionStore.ts): transaction CRUD and recurring store state
- [`src/lib/features/transactions/services/recurringEngine.ts`](src/lib/features/transactions/services/recurringEngine.ts): recurring materialization engine
- [`src/lib/services/syncEngine.ts`](src/lib/services/syncEngine.ts): Firestore sync engine
- [`src/lib/components/ui/SearchableSelect.svelte`](src/lib/components/ui/SearchableSelect.svelte): searchable category combobox
- [`svelte.config.js`](svelte.config.js): SvelteKit config using the Vercel adapter
- [`vite.config.ts`](vite.config.ts): Vite + PWA configuration

## Local Development

### Prerequisites

- Node.js 22+ recommended
- npm 10+ recommended

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

### Useful commands

```bash
npm run check
npm run build
npm run preview
npm run format
npm run lint
```

## Data Model

The local Dexie database uses these tables:

- `transactions`
- `categories`
- `recurring_transactions`
- `sync_metadata`
- `settings`

### Transactions

Transactions store:

- amount
- type
- category
- payment method
- date
- note
- sync status
- deleted flag

### Categories

Categories are seeded by default for both expense and income types and can be edited in-app.

### Recurring Transactions

Recurring transactions support:

- weekly
- monthly
- yearly

On app startup, the recurring engine checks due entries and generates local transactions.

## Offline Behavior

The app is currently local-first in behavior:

- writes are stored locally in IndexedDB
- UI updates immediately
- transactions remain available offline
- sync metadata is tracked locally

This works well for a frontend-only deployment, including Vercel.

## Sync and Auth Status

Firebase packages are installed, but production auth/sync is not wired yet.

Current behavior:

- auth defaults to a local guest session
- manual sync does not push to a remote backend yet
- sync status communicates that Firebase sync is not configured

To complete cloud sync, you would need to:

1. Create a Firebase project.
2. Copy `.env.example` to `.env` and fill in the Firebase web config values.
3. Add those same environment variables in Vercel for production deployment.
4. Implement Google auth in `src/lib/services/auth.ts`.
5. Implement Firestore upload/download logic in `src/lib/services/syncEngine.ts`.

Expected environment file:

```bash
cp .env.example .env
```

The template file includes:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

## Deployment

### Vercel

This project is configured for Vercel via `@sveltejs/adapter-vercel`.

Build verification already passes locally with:

```bash
npm run build
```

For deployment:

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Use the default SvelteKit build settings detected by Vercel.
4. Add environment variables later if Firebase is enabled.

### Notes for Vercel

- Dexie/IndexedDB runs in the browser, so it is compatible with Vercel hosting.
- Because the current app is mostly client-driven, deployment is straightforward.
- PWA manifest colors are aligned with the current design palette.

## Design Notes

The current visual system intentionally avoids the common generic blue-on-white dashboard look.

Design choices in the app:

- warm neutral background
- deep teal accent
- emerald income color
- terracotta expense color
- different mobile and desktop navigation models

Mobile:

- fixed bottom navigation
- compact app header

Desktop:

- persistent left sidebar
- desktop page header
- wider workspace layout

## Known Limitations

- No backend sync yet
- No authenticated user accounts yet
- No server-side reporting or analytics
- Currency is fixed to INR in the UI
- Some pages can still be further refined for desktop-specific layouts

## Roadmap Suggestions

Reasonable next steps:

1. Implement Firebase Auth + Firestore sync.
2. Add toast feedback for save/delete/sync actions.
3. Improve desktop layouts for transactions and insights.
4. Add tests for stores and recurring logic.
5. Add import/export improvements beyond CSV.

## License

No license has been added yet. Add one before publishing publicly if needed.
