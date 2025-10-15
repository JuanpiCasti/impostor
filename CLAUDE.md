# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Impostor is an online multiplayer social deduction game. This is a pnpm monorepo with three packages:
- **backend** - TypeScript/Node.js server with Socket.io and Express
- **frontend** - React 19 + Vite application
- **schemas** - Shared Zod validation schemas used by both backend and frontend

## Development Commands

**Root level:**
- `pnpm dev` - Run all packages in development mode concurrently
- `pnpm build` - Build all packages
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code across all packages

**Backend (packages/backend):**
- `pnpm dev` - Run backend in watch mode using nodemon + ts-node
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run compiled JavaScript from dist/
- `pnpm test` - Run Jest tests
- `pnpm lint` - Lint backend code
- `pnpm format` - Format backend code

**Frontend (packages/frontend):**
- `pnpm dev` - Start Vite development server
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint frontend code
- `pnpm format` - Format frontend code

**Schemas (packages/schemas):**
- `pnpm build` - Compile TypeScript schemas to dist/
- `pnpm lint` - Lint schemas code
- `pnpm format` - Format schemas code

## Architecture

### Backend Architecture (packages/backend)

The backend uses a layered architecture with Socket.io for real-time communication and Express for HTTP endpoints. Application entry point is `src/index.ts` which wires together all dependencies using factory functions and dependency injection.

**Key Architectural Patterns**:
- Factory functions returning interfaces (not classes) for all services
- Dependencies injected at app startup in `index.ts`
- Repository pattern for data access with swappable implementations (Memory/MongoDB)
- Strategy pattern for impostor selection algorithms
- Controller pattern for handling Socket.io events with session management

**Session Management** (`src/session/`):
- `Session.manager.ts` - Maps Socket.io connections to player IDs and tracks which rooms players are in
- `MemorySessionManager` - In-memory implementation using Maps for bidirectional lookups
- Sessions are created on WebSocket connection and destroyed on disconnect
- Tracks `Set<RoomIdentifier>` per session for multi-room cleanup

**Room Layer** (`src/room/`):
- `Room.ts` - Room entity with roomId (6-char alphanumeric), players, word, maxPlayers, impostor, status (CREATING/STARTED)
- `Room.repository.ts` - RoomRepository interface with MemoryRoomRepository implementation
- `Room.service.ts` - Core room logic:
  - `createRoom` - Creates room with random word from category (3-10 players)
  - `joinRoom` - Adds players, validates capacity/status, auto-starts when full
  - `leaveRoom` / `leaveRooms` - Removes players, deletes empty rooms
  - `startRoom` - Assigns roles via strategy, transitions to STARTED
- `Room.controller.ts` - Bridges Socket.io events and RoomService, handles session tracking
- `Room.handler.ts` - Registers Socket.io event handlers (`join-room`, `disconnect`) and Express routes (`POST /room`)
- `Room.notifier.ts` - Sends notifications to players via Socket.io (`player-joined`, `room-start`)
- `Room.error.ts` - Custom error types (RoomFullError, RoomAlreadyStartedError, RoomNotFoundError, etc.)

**Player Layer** (`src/player/`):
- `Player.ts` - Player entity with id, name, and optional role
- `Role.ts` - Player roles (PLAYER, IMPOSTOR)
- `Player.notifier.ts` - SocketIOPlayerNotificationService sends notifications to specific players using SessionManager
- `impostor/` - Strategy pattern for role assignment:
  - `ImpostorStrategy.ts` - Interface for role assignment strategies
  - `ImpostorStrategyFactory.ts` - Factory for creating strategies (RANDOM, ALL_IMPOSTOR enum - only RANDOM implemented)
  - `RandomImpostorStrategy.ts` - Randomly selects one impostor from players

**Category/Word Layer** (`src/category/`):
- `Word.ts` / `Category.ts` - Type definitions for words and categories
- `Word.provider.ts` - WordProvider interface with MemoryWordProvider and MongoWordProvider implementations
  - Provides random word selection from categories via MongoDB aggregation
- `Category.repository.ts` - CategoryRepository with MongoCategoryRepository implementation
- `Category.service.ts` - `getAllCategories` service method
- `Category.handler.ts` - `GET /categories` HTTP endpoint

**Infrastructure**:
- `logger/Logger.ts` - Pino logger factory (respects LOG_LEVEL env var)
- `logger/LoggingMiddleware.ts` - Express and Socket.io logging middleware
- `db/createDatabaseClient.ts` - MongoDB client factory with connection handling
- Environment configuration via dotenv (see .env.example: MONGO_URI, MONGO_DATABASE, PORT, ALLOWED_ORIGINS, LOG_LEVEL, NODE_ENV)

**Communication Patterns**:
- HTTP (Express): Room creation (`POST /room`), category listing (`GET /categories`)
- WebSocket (Socket.io): Room joining (`join-room` event), game start notifications (`room-start`, `player-joined`)
- Players join Socket.io rooms matching the game roomId for targeted broadcasting

### Frontend Architecture (packages/frontend)

React 19 + Vite application using React Router 7 and Ant Design components:

**Routing** (`src/App.tsx`):
- `/` - StartMenu (home screen)
- `/create-room` - RoomCreationForm (create new room)
- `/join-room` - RoomJoinForm (join existing room)
- `/room` - GameRoom (game lobby and gameplay)

**Game Flow** (`src/features/game-room/`):
- `GameRoom.tsx` - Main game component, manages Socket.io connection and game state
  - Connects to WebSocket, emits `join-room` event
  - Listens for `player-joined`, `room-start`, `room-error` events
  - Transitions: Loading → WaitingRoom → Countdown → DisplayWord
- `WaitingRoom.tsx` - Shows joined players, room code, waiting for game to start
- `Countdown.tsx` - 5-second countdown before revealing word
- `DisplayWord.tsx` - Shows player's role and word (or just role for impostor)

**API Layer** (`src/api/`):
- `createRoom.ts` - HTTP POST to `/room` endpoint
- `fetchCategories.ts` - HTTP GET to `/categories` endpoint
- Uses axios for HTTP requests, Socket.io client for WebSocket

**Environment Variables**:
- `VITE_API_BASE_URL` - Backend HTTP endpoint (default: http://localhost:3000)
- `VITE_WS_BASE_URL` - Backend WebSocket endpoint (default: localhost:3000)

### Schemas Package (packages/schemas)

Centralized Zod schemas for type-safe validation and TypeScript types shared between backend and frontend:

**Available Schemas** (`src/room.schemas.ts`):
- `CreateRoomRequestSchema` - Room creation validation (maxPlayers: int, category: string 3-10 chars)
- `JoinRequestSchema` - Join validation (playerName: string 3-10 chars, roomId: string exactly 6 chars)
- `CreateRoomResponse`, `CategoriesResponse` - Response types
- `PlayerJoinedNotification`, `RoomStartNotification` - WebSocket notification types
- `RoomStatus` - Enum (CREATING, STARTED)

## Docker Configuration

The project includes Docker setup for both development and production environments:

**Docker Compose Files:**
- `docker-compose.yml` - Production configuration with all three services (mongo, backend, frontend)
- `docker-compose-development.yml` - Development configuration (MongoDB only, expose port 27017)

**Multi-stage Dockerfile:**
- `base` stage - Node.js Alpine with pnpm enabled via corepack
- `build` stage - Installs dependencies, builds all packages, creates production deployments
- `backend` stage - Production backend image, runs compiled JavaScript via `pnpm start`, exposes port 3000
- `frontend` stage - nginx Alpine serving built static files, uses custom nginx.conf for SPA routing, exposes port 80

**Services:**
- `mongo` - MongoDB 8.0.15 with authentication, runs initialization scripts from `scripts/mongo/init-word-collection.js`
- `backend` - Node.js backend service, depends on mongo
- `frontend` - nginx serving React build, depends on backend

**Running with Docker:**
```bash
# Production (all services)
docker compose up

# Development (MongoDB only, run backend/frontend locally)
docker compose -f docker-compose-development.yml up
```

**Volumes:**
- `mongo-impostor` - Persists MongoDB data
- `mongo-impostor-config` - Persists MongoDB configuration

**Network:**
- `app_network` - Internal network connecting all services

## Technical Details

- **Package Manager:** pnpm (v10.18.0)
- **TypeScript:** Strict mode enabled, ES2023 target, NodeNext module resolution
- **Backend Runtime:** Node.js with nodemon + ts-node for development, Jest with ts-jest for testing
- **Backend Database:** MongoDB 8.0.15 for categories/words, in-memory Map for rooms/sessions
- **Frontend Build:** Vite with React 19, Ant Design for UI components
- **Frontend Production:** nginx Alpine serving static build with SPA routing support
- **Code Quality:** ESLint + Prettier configured at root and package level
- **WebSocket:** Socket.io for real-time bidirectional communication
- **Containerization:** Multi-stage Docker builds, Docker Compose orchestration
