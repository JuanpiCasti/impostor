# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Backend Architecture

This backend uses Socket.io for real-time multiplayer game communication and Express for REST API endpoints.

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

**Category** (`src/category/`):
- `Category.ts` - Category type definition
- `Word.ts` - Word type definition
- `Category.repository.ts` - CategoryRepository interface and MemoryCategoryRepository implementation
- `Category.service.ts` - CategoryService for managing categories

**Player** (`src/player/`):
- `Player.ts` - Player entity with identifier and name
- `Player.repository.ts` - PlayerRepository interface and implementation
- `Player.service.ts` - PlayerService for managing players
- `Player.provider.ts` - Player provider utilities

**Game** (`src/game/`):
- `Game.ts` - Game entity with players, word, max players, and impostor
- `Game.repository.ts` - GameRepository interface and MemoryGameRepository implementation (in-memory Map storage)
- `Game.service.ts` - GameService interface and createGameService factory
- `Game.schemas.ts` - Zod schemas for request validation (CreateGameRequestSchema, JoinRequestSchema)
- `Game.handler.ts` - Express route handlers (createCreateGameHandler)

**Entry point** (`src/index.ts`):
- Initializes Express app and Socket.io server
- Wires up dependencies (repositories → services → handlers)
- Sets up REST endpoints and Socket.io event handlers
- Configured with CORS and environment variables

### Dependency Injection

Use functional dependency injection pattern:

- Factory functions accept dependencies as parameters
- Wire up dependencies in `src/index.ts` when initializing Express app and Socket.io
- Keep services pure and testable by injecting all dependencies

Example wiring:

```typescript
const gameRepo = MemoryGameRepository()
const gameService = createGameService(gameRepo)
const createGameHandler = createCreateGameHandler(gameService)

app.use(express.json())
app.post("/game", createGameHandler)

io.on("connection", (socket) => {
  socket.on("join-game", (id, playerName) =>
    gameService.joinGame(id, playerName),
  )
  socket.on("start-game", (id) => gameService.startGame(id))
})
```

### Request Validation

Use Zod for request validation in handlers:

- Define schemas in `*.schemas.ts` files
- Use `safeParse()` for validation with proper type narrowing
- Check `!parsedData.success` and return early on validation errors
- Access validated data via `parsedData.data` after success check

Example:

```typescript
export function createCreateGameHandler(gameService: GameService) {
  return async (req: Request, res: Response) => {
    const parsedData = CreateGameRequestSchema.safeParse(req.body)
    if (!parsedData.success) {
      res.status(400).json(parsedData.error)
      return
    }
    const gameId = await gameService.createGame(parsedData.data)
    res.json({ gameId })
  }
}
```

## Naming Conventions

### Files and Directories

- **Entity files**: PascalCase singular - `Game.ts`, `Player.ts`, `Category.ts`, `Word.ts`
- **Repository files**: PascalCase singular with suffix - `Game.repository.ts`, `Player.repository.ts`
- **Service files**: PascalCase singular with suffix - `Game.service.ts`, `Player.service.ts`, `Category.service.ts`
- **Schema files**: PascalCase singular with suffix - `Game.schemas.ts`
- **Handler files**: PascalCase singular with suffix - `Game.handler.ts`
- **Directories**: lowercase singular - `src/game/`, `src/player/`, `src/category/`

### TypeScript Constructs

- **Types and Interfaces**: PascalCase - `Game`, `Player`, `GameRepository`, `GameService`
- **Type Identifiers**: PascalCase with `Identifier` suffix - `GameIdentifier`, `PlayerIdentifier`
- **Factory functions**: camelCase with `create` prefix for services - `createGameService()`, `createPlayerService()`
- **Factory functions**: PascalCase for repositories - `MemoryGameRepository()`, `RedisGameRepository()`
- **Interface methods**: camelCase - `joinGame`, `startGame`, `getGame`, `createGame`
- **Variables and parameters**: camelCase - `gameRepository`, `playerName`, `maxPlayers`
- **Constants**: UPPER_SNAKE_CASE - `MAX_PLAYERS`, `DEFAULT_TIMEOUT`

### Socket.io Events

- **Event names**: kebab-case - `join-game`, `start-game`, `leave-game`, `player-joined`
- **Client → Server events**: Imperative verbs - `join-game`, `start-game`, `submit-answer`
- **Server → Client events**: Past tense or state changes - `game-started`, `player-joined`, `word-assigned`

### Code Style

- Use `const` by default, `let` only when reassignment is needed
- Prefer explicit return types on public interface methods
- Use async/await over raw Promises
- Arrow functions for object methods to avoid `this` binding issues
