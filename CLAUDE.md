# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Impostor is an online multiplayer game inspired by Impostor-type social deduction games. This is a pnpm monorepo with a TypeScript backend and React frontend.

## Development Commands

**Root level:**
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code across all packages

**Backend (packages/backend):**
- `pnpm dev` - Run backend in watch mode using nodemon + ts-node
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm test` - Run Jest tests
- `pnpm lint` - Lint backend code
- `pnpm format` - Format backend code

**Frontend (packages/frontend):**
- `pnpm dev` - Start Vite development server
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint frontend code
- `pnpm format` - Format frontend code

## Architecture

### Backend Architecture (packages/backend)

The backend uses a layered architecture with Socket.io for real-time communication and Express for HTTP endpoints. Application entry point is `src/index.ts` which wires together all dependencies and registers handlers.

**Dependency Injection & Initialization**:
- All services use factory functions returning interfaces (not classes)
- Dependencies injected at app startup in `index.ts`
- In-memory implementations (MemoryGameRepository, MemoryPlayerProvider, MemoryWordProvider) for current stage

**Category/Word Layer** (`src/category/`):
- `Word.ts` / `Category.ts` - Type definitions for words and categories
- `Word.provider.ts` - WordProvider interface and MemoryWordProvider
  - Stores category-to-words mappings (currently: football → messi, cr7, modric)
  - Provides random word selection from categories

**Player Layer** (`src/player/`):
- `Player.ts` - Player entity with id, name, and optional role
- `Role.ts` - Player roles (PLAYER, IMPOSTOR)
- `Player.provider.ts` - Maps player IDs to Socket.io connection IDs (for notifying specific players)
- `impostor/` - Strategy pattern for impostor selection
  - `ImpostorStrategy.ts` - Interface for role assignment strategies
  - `ImpostorStrategyFactory.ts` - Factory for creating strategies (RANDOM, ALL_IMPOSTOR)
  - `RandomImpostorStrategy.ts` - Randomly selects one impostor from players

**Game Layer** (`src/game/`):
- `Game.ts` - Game entity with gameId, players, word, maxPlayers, impostor, status (CREATING/STARTED)
- `Game.repository.ts` - GameRepository interface and MemoryGameRepository
  - Creates games with 6-character alphanumeric IDs
  - In-memory Map storage for games
- `Game.service.ts` - Core game logic
  - `createGame` - Creates game with random word from category (3-10 players)
  - `joinGame` - Adds players, validates room capacity and game status, returns whether to start
  - `startGame` - Assigns roles via strategy, transitions to STARTED, notifies players
- `Game.handler.ts` - Socket.io event handlers and Express routes
  - Socket: `join-game` event (joins room, triggers start if full)
  - HTTP: `POST /game` endpoint (creates new game via JSON body)
- `Game.notifier.ts` - Sends notifications to players via Socket.io
  - `GAME_START` notification sends role + word (or role only for impostor)
- `Game.schemas.ts` - Zod schemas for request validation
- `Game.error.ts` - Custom error types (RoomFullError, GameAlreadyStartedError)

**Infrastructure**:
- `logger/Logger.ts` - Pino logger factory (respects LOG_LEVEL env var)
- Environment configuration via dotenv (.env.example: PORT, ALLOWED_ORIGINS, LOG_LEVEL, NODE_ENV)

**Key patterns:**
- Repository pattern for data access (interface-based, swappable implementations)
- Strategy pattern for impostor selection (extensible to multiple algorithms)
- Factory functions instead of classes (functional-style dependency injection)
- Type-safe identifiers (GameIdentifier, PlayerIdentifier as string type aliases)
- Dual communication: Socket.io for game events, Express for game creation

### Frontend Architecture (packages/frontend)

React + Vite + TypeScript setup:
- Standard Vite React template (currently boilerplate)
- Will communicate with backend via Socket.io

## Technical Details

- **Package Manager:** pnpm (v10.18.0)
- **TypeScript:** Strict mode enabled, ES2023 target, NodeNext module resolution
- **Backend Runtime:** Node.js with nodemon + ts-node for development, Jest with ts-jest for testing
- **Frontend Build:** Vite with React 19
- **Code Quality:** ESLint + Prettier configured at root and package level