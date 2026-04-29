# Alphabet Game

A full-stack TypeScript application with SolidJS frontend and Fastify backend, built for an alphabet-based quiz game. **Powered by Bun for blazing-fast development!**

## Why Bun?

This project uses [Bun](https://bun.sh) instead of Node.js/npm for:
- ⚡ **3x faster installation** - Install dependencies in seconds
- 🚀 **Fast dev server** - Hot reload with `bun --watch`
- 📦 **Built-in bundler** - No need for separate build tools
- 🔄 **Drop-in replacement** - Works with existing npm packages
- 💪 **Native TypeScript** - Run `.ts` files directly

## Project Structure

```
alphabet-game/
├── backend/           # Fastify API server
│   ├── src/
│   │   ├── db/       # Database setup and schema
│   │   └── index.ts  # Server entry point
│   └── drizzle.config.ts
├── frontend/          # SolidJS application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── api/         # API client utilities
│   │   ├── App.tsx      # Main app component
│   │   └── index.tsx    # Entry point
│   └── index.html
├── bunfig.toml        # Bun configuration
└── package.json       # Monorepo config
```

## Tech Stack

### Frontend
- **SolidJS** - Reactive UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server

### Backend
- **Fastify** - Fast web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe database queries
- **SQLite** - Embedded database (via better-sqlite3)
- **Bun Runtime** - Native TypeScript execution with hot reload

### DevOps
- **ESLint** - Code linting
- **standard-version** - Semantic versioning and changelog
- **Bun** - Fast package manager and runtime

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) 1.0+ (Install: `curl -fsSL https://bun.sh/install | bash`)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up your database schema in `backend/src/db/schema.ts`

3. Generate and run migrations:
```bash
cd backend
bun run db:generate
bun run db:migrate
```

### Development

Start both frontend and backend in development mode:
```bash
bun run dev
```

Or start them separately:
```bash
# Terminal 1 - Backend (http://localhost:3000)
bun run dev:backend

# Terminal 2 - Frontend (http://localhost:5173)
bun run dev:frontend
```

### Building for Production

```bash
bun run build
```

## Database Management

The example schema in `backend/src/db/schema.ts` shows how to define tables. For your alphabet game, you might want:

- **users** - Player accounts
- **game_sessions** - Track active games
- **questions** - Store questions for each letter
- **answers** - Store player responses
- **scores** - Leaderboard data

### Drizzle Commands

```bash
cd backend

# Generate migrations after schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# Open Drizzle Studio (visual database manager)
bun run db:studio
```

## Code Quality

### Linting
```bash
bun run lint        # Lint all workspaces
bun run typecheck   # Type check all workspaces
```

### Versioning

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for semantic versioning based on conventional commits.

```bash
# Create a new release
bun run release

# Release specific versions
bun run release -- --release-as minor
bun run release -- --release-as major
```

#### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example:
```bash
git commit -m "feat: add letter validation logic"
git commit -m "fix: correct scoring calculation"
```

## API Endpoints

The backend includes example endpoints:

- `GET /api/health` - Health check
- `GET /api/example` - Example database query
- `POST /api/check-answer` - Example game logic endpoint

Add your own endpoints in `backend/src/index.ts`.

## Frontend Components

The frontend includes an example component structure:

- `App.tsx` - Main application
- `components/ExampleComponent.tsx` - Example SolidJS component with Tailwind
- `api/index.ts` - API client utilities

Replace these with your game components!

## Environment Variables

Create `.env` files if needed:

```env
# backend/.env
DATABASE_URL=./sqlite.db
PORT=3000

# frontend/.env
VITE_API_URL=http://localhost:3000
```

## Game Implementation Ideas

For your alphabet game:

1. **Question Flow**: Create a component that displays the current letter and prompt
2. **Answer Input**: Add a form for user input with validation
3. **Progress Tracking**: Show which letters have been completed
4. **Scoring System**: Implement points based on answer quality/speed
5. **Leaderboard**: Display top scores from the database

## Tips

- The Vite dev server proxies `/api/*` requests to the backend
- Use Drizzle Studio to inspect your database visually
- SolidJS uses fine-grained reactivity - use `createSignal` for state
- Tailwind classes are available immediately - no build step needed
- Bun runs TypeScript natively - no compilation needed in dev mode!

## License

MIT

test versioning
