# ConvertCart Frontend

Frontend for the ConvertCart expense tracker. The app lets users create expenses, filter expense records, delete expenses, and view category-wise spending summaries.

## Tech Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack React Query
- Axios
- Joi

## Prerequisites

- Node.js 20 or later
- npm
- A running backend API for categories, expenses, and summaries

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```bash
VITE_BASE_URL=
```

Update the URL to match your backend server.

3. Start the development server:

```bash
npm run dev
```

4. Open the local Vite URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs TypeScript build checks and creates the production build.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run preview
```

Serves the production build locally for preview.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_BASE_URL` | Yes | Base URL for the backend API used by Axios. |

The app throws an error during startup if `VITE_BASE_URL` is missing.

## Folder Structure

```text
frontend/
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- assets/
|   |   |
|   |-- components/
|   |   `-- expenses/
|   |       |-- CategorySummary.tsx
|   |       |-- DeleteExpenseModal.tsx
|   |       |-- ExpenseDialog.tsx
|   |       |-- ExpenseFilters.tsx
|   |       |-- ExpenseForm.tsx
|   |       `-- ExpenseList.tsx
|   |-- config/
|   |   `-- axios.ts
|   |-- hooks/
|   |   `-- useDebounce.ts
|   |-- lib/
|   |   `-- toast.tsx
|   |-- services/
|   |   `-- expense.ts
|   |-- validations/
|   |   `-- expense.ts
|   |-- App.css
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- AGENTS.md
|-- eslint.config.js
|-- index.html
|-- package.json
|-- package-lock.json
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Source Overview

- `src/main.tsx` mounts the React app and configures React Query.
- `src/App.tsx` contains the main expense tracker layout and page-level state.
- `src/config/axios.ts` creates the shared Axios client using `VITE_BASE_URL`.
- `src/services/expense.ts` contains expense API calls, response types, query keys, and React Query hooks.
- `src/components/expenses/` contains the expense form, filters, list, dialog, delete modal, and summary UI.
- `src/validations/expense.ts` contains Joi validation for expense form data.
- `src/index.css` imports Tailwind CSS v4.

## API Expectations

The frontend expects the backend API to expose these endpoints relative to `VITE_BASE_URL`:

```text
GET    /categories
GET    /expenses
POST   /expenses
DELETE /expenses/:expenseId
GET    /summary
```

Responses are expected to use a `success`, `message`, and `data` shape.

## Validation Before Commit

Run these checks before committing frontend changes:

```bash
npm run lint
npm run build
```
