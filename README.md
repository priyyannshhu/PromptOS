# PromptOS

> A small Next.js-based playground for prompt engineering and prompt compilation.

## Overview

PromptOS provides a UI and server APIs to analyze user intent, generate optimized system/user prompts, build a simple AST representation of prompts, and produce basic metrics (token estimate, cost, reliability, complexity). It includes a Next.js frontend and lightweight API routes used by the editor UI.

## Key Features
- Intent analysis and prompt compilation (`lib/compiler-engine.ts`).
- Integration points for running models (`lib/models/adapter.ts`).
- Simple in-memory versioning for saved prompt versions (API routes).
- Component-driven UI in `components/` for editor, toolbar, panels, and theme.

## Tech stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Uses Google generative AI client libraries (project has `@google/genai` and `@google/generative-ai` listed as dependencies)

## Quickstart

Prerequisites
- Node.js (18+ recommended)
- pnpm (recommended) or npm/yarn

Install

```bash
pnpm install
# or
npm install
```

Run development server

```bash
pnpm dev
# or
npm run dev
```

Build

```bash
pnpm build
# or
npm run build
```

Start (production)

```bash
pnpm start
# or
npm run start
```

Lint

```bash
pnpm lint
# or
npm run lint
```

## API Endpoints

All API routes use the Next.js App Router under `app/api`.

- POST `/api/compile` — compile/optimize a prompt. Expects JSON body `{ code: string, model?: string }`. Currently supports `model: "gemini"` only.
- POST `/api/save-version` — save a named version of a prompt (in-memory). Expects `{ name, content, model, metrics }`.
- GET `/api/save-version` — list saved versions (in-memory).
- DELETE `/api/versions?id=<versionId>` — delete a saved version (in-memory store).

Example compile request

```bash
curl -X POST http://localhost:3000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"Summarize this text in 3 bullets.", "model":"gemini"}'
```

Response shape (example)

```json
{
  "success": true,
  "data": {
    "systemPrompt": "...",
    "userPrompt": "...",
    "ast": { /* simplified AST */ },
    "metrics": {
      "estimatedTokens": 10,
      "estimatedCost": 0.0000,
      "reliabilityScore": 85,
      "complexityScore": 10
    },
    "model": "gemini",
    "compiledAt": "2026-02-21T..."
  }
}
```

## Important files
- `lib/compiler-engine.ts` — core intent analysis, prompt generation, AST and metrics calculation.
- `lib/models/adapter.ts` — thin adapter to call a model provider (Gemini). Configure API keys here.
- `app/api/compile/route.ts` — route that orchestrates compilation and model calls.
- `app/api/save-version/route.ts` & `app/api/versions/route.ts` — lightweight in-memory persistence for prompt versions.
- `components/` — UI components, panels, editor, toolbar, history panel, and small UI primitives under `components/ui/`.

## Notes & Caveats
- The current versions API is in-memory and not persistent. Replace with a database (Postgres, SQLite, etc.) for production.
- The model integration references Gemini and the `@google/genai` packages; ensure proper credentials and project configuration before calling remote models.
- `next.config.mjs` is configured to ignore TypeScript build errors (`ignoreBuildErrors: true`) and to serve images unoptimized — review for production readiness.

## Contributing
- Fork and open a PR. Keep changes focused and add tests where appropriate.

## License
This repository does not include an explicit license file. Add a `LICENSE` if you intend to open-source this project.

---

If you'd like, I can:
- commit this README and run `pnpm dev` to smoke-test the app locally, or
- add environment variable guidance and a `.env.example` file for model credentials.
