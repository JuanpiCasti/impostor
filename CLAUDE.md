# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Impostor is an online multiplayer game inspired by Impostor-type social deduction games. This is a pnpm monorepo with a TypeScript backend and React frontend.

## Development Commands

**Root level:**
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code across all packages

**Backend (packages/backend):**
- `pnpm dev` - Run backend in watch mode using tsx
- `pnpm build` - Compile TypeScript to JavaScript
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

The backend uses a layered architecture with Socket.io for real-time communication:

**Domain Layer** (`src/domain/`):
- Type definitions for core domain concepts (Word, Category)

**Player Layer** (`src/player/`):
- Player entity with identifier and name

**Game Layer** (`src/game/`):
- `Game.ts` - Game entity with players, word, max players, and impostor
- `Game.repository.ts` - GameRepository interface and MemoryGameRepository implementation
  - In-memory storage using Map for games and categories
  - Creates games with random words from category lists
- `Game.service.ts` - GameService with GameJoiner function
  - Handles player joining logic
  - TODO: Game start logic when max players reached (word assignment, impostor selection, notifications)

**Key patterns:**
- Repository pattern for data access (currently in-memory, extensible to Redis/DB)
- Functional dependency injection (GameJoiner receives GameRepository)
- Type-safe identifiers (GameIdentifier, PlayerIdentifier)

### Frontend Architecture (packages/frontend)

React + Vite + TypeScript setup:
- Standard Vite React template (currently boilerplate)
- Will communicate with backend via Socket.io

## Technical Details

- **Package Manager:** pnpm (v10.18.0)
- **TypeScript:** Strict mode enabled, ES2023 target, NodeNext module resolution
- **Backend Runtime:** Node.js with tsx for development
- **Frontend Build:** Vite with React 19
- **Code Quality:** ESLint + Prettier configured at root and package level
