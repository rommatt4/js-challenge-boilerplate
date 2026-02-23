# Kinsurance OCR (Stories 1-3)

Angular + TypeScript implementation of the Kin Insurance OCR take-home challenge for the senior track, covering:

- User Story 1: CSV upload with validation (CSV only, max 2 MB)
- User Story 2: Policy checksum validation and result display
- User Story 3: Submit processed policy objects to API and show success/failure with response ID

## Tech choices

- Angular standalone components for modular, reusable UI
- Pure utility functions for parsing and checksum logic
- Single API service for network calls
- Focus on readability, simple flow, and testability

## Project structure

- `src/app/components/file-upload` - reusable CSV upload component
- `src/app/components/policy-table` - reusable results table component
- `src/app/components/status-alert` - reusable success/error feedback component
- `src/app/services/policy-api.service.ts` - API integration
- `src/app/utils/csv.util.ts` - CSV/file validation + parsing utilities
- `src/app/utils/checksum.util.ts` - checksum validation utility
- `src/app/models/policy.model.ts` - shared types

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)

## Setup

```bash
npm install
```

## Run locally

```bash
npm start
```

Open `http://localhost:4200/`.

## Run tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Behavior notes / assumptions

- Policy numbers are treated as strings in memory to preserve leading zeros safely.
- CSV parsing accepts comma-separated values across multiple lines and ignores non-numeric tokens.
- Checksum expects exactly 9 digits per policy number, matching the challenge formula.
- Empty/invalid CSV content fails gracefully with a clear UI message.

## Accessibility and responsiveness

- Semantic elements and accessible table labels are used.
- Upload control includes labels and clear helper text.
- Layout and table are responsive (mobile-safe, horizontal scroll for table when needed).
- Styling uses the provided Kin color palette CSS variables.

## Questions noted for Design/Product

- Should rows with non-numeric values be shown as invalid rows, or skipped entirely?
- Should duplicate policy numbers be preserved, deduplicated, or flagged?
- Should API submission include metadata (uploaded filename, timestamp, user)?
