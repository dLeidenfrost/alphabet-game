# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root using Bun.

```bash
# Install dependencies
bun install

# Start both frontend and backend concurrently
bun run dev

# Start individually
bun run dev:backend    # http://localhost:3000 (hot reload via bun --watch)
bun run dev:frontend   # http://localhost:5173 (Vite)

# Lint and typecheck all workspaces
bun run lint
bun run typecheck

# Build for production
bun run build

# Database (run from backend/)
cd backend
bun run db:generate    # Generate migrations after schema changes
bun run db:migrate     # Apply migrations
bun run db:studio      # Open Drizzle Studio visual DB manager
```

There is no test runner configured yet.

## Architecture

This is a Bun monorepo with two workspaces: `backend/` and `frontend/`.

### Backend (`backend/`)

- **Fastify** HTTP server defined entirely in `src/index.ts` — all routes live there.
- **Drizzle ORM** with **SQLite** (`sqlite.db` in `backend/`). The database connection uses Bun's built-in `bun:sqlite` driver (`src/db/index.ts`).
- Schema is in `src/db/schema.ts`. After any schema change, run `db:generate` then `db:migrate`.
- On startup, the server auto-populates the `letters` table with a–z plus ñ if empty.

**Data model:**
- `quizzes` → contain many `questions`
- `questions` → belong to a `quiz` and a `letter`, have one `answer`
- `gameSessions` → link a `user` to a `quiz`, track `currentQuestionId` and `score`
- `gameSessionQuestions` → join table tracking which questions are answered in a session

### Frontend (`frontend/`)

- **SolidJS** with fine-grained reactivity. Use `createSignal`/`createMemo`/`createEffect` — not React hooks.
- **Tailwind CSS** for styling; **Vite** as dev server and bundler.
- Vite proxies all `/api/*` requests to `http://localhost:3000`, so the frontend uses relative `/api/...` paths.
- API client utilities live in `src/api/`. Components go in `src/components/`.

### Commit convention

This project uses Conventional Commits for `standard-version` changelogs:
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`
