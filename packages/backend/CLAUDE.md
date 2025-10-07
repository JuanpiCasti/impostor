# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Backend Architecture

This backend uses Socket.io for real-time multiplayer game communication.

### Code Organization Pattern

**Use object factory pattern for services:**

```typescript
export interface GameService {
  joinGame: (id: GameIdentifier, playerName: string) => Promise<void>
  startGame: (id: GameIdentifier) => Promise<void>
  leaveGame: (id: GameIdentifier, playerId: PlayerIdentifier) => Promise<void>
}

export function createGameService(gameRepository: GameRepository): GameService {
  return {
    joinGame: async (id, playerName) => { ... },
    startGame: async (id) => { ... },
    leaveGame: async (id, playerId) => { ... }
  }
}
```

**Why this pattern:**
- Groups related operations together in a single namespace
- Clean object factory with explicit dependency injection
- No class boilerplate while maintaining good organization
- Arrow functions in returned object avoid `this` binding issues
- Well-suited for Socket.io event handlers that need shared services

### TypeScript Interfaces

**Always define interfaces for:**
- **Repositories** - Enables swapping implementations (memory, Redis, database) and easier testing
- **Services** - Documents the API contract and validates implementations

**Interface implementation:**
- TypeScript uses structural typing (duck typing) - objects automatically implement interfaces if they match the shape
- No explicit `implements` keyword needed for object literals
- Use arrow function syntax in interface definitions: `methodName: (params) => ReturnType`
- Implementations can use either arrow functions or regular methods - both satisfy the interface

Example:
```typescript
interface GameRepository {
  getGame: (id: GameIdentifier) => Promise<Game>
  createGame: (category: Category, maxPlayers: number) => Promise<Game>
}

// Automatically implements GameRepository
export function MemoryGameRepository(): GameRepository {
  return {
    getGame: async (id) => { ... },
    createGame: async (category, maxPlayers) => { ... }
  }
}
```

### Layer Structure

**Domain** (`src/domain/`):
- Type definitions for core concepts (Word, Category)
- Pure type aliases, no business logic

**Entities** (`src/player/`, `src/game/`):
- Core entity type definitions (Player, Game)
- Type-safe identifiers (GameIdentifier, PlayerIdentifier)

**Repository** (`*.repository.ts`):
- Interface defines data access contract
- Factory functions return implementations
- Currently using in-memory Map storage (extensible to Redis/DB later)

**Services** (`*.service.ts`):
- Interface defines business operations
- Factory functions receive dependencies and return service implementation
- Business logic layer between Socket.io handlers and repositories

### Dependency Injection

Use functional dependency injection pattern:
- Factory functions accept dependencies as parameters
- Wire up dependencies in `src/index.ts` when initializing Socket.io
- Keep services pure and testable by injecting all dependencies

Example wiring:
```typescript
const gameRepository = MemoryGameRepository()
const gameService = createGameService(gameRepository)

io.on('connection', (socket) => {
  socket.on('join-game', (id, playerName) =>
    gameService.joinGame(id, playerName)
  )
  socket.on('start-game', (id) =>
    gameService.startGame(id)
  )
})
```
