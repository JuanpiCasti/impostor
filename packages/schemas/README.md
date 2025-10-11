# @impostor/schemas

Shared Zod validation schemas for the Impostor game project.

## Overview

This package contains all Zod schemas used for request validation and type safety across the Impostor monorepo. By centralizing schemas in a shared package, both frontend and backend can import and use the same validation logic and TypeScript types.

## Usage

Install as a workspace dependency:

```bash
pnpm add @impostor/schemas
```

Import schemas in your code:

```typescript
import { CreateGameRequestSchema, JoinRequestSchema } from "@impostor/schemas"
```

## Available Schemas

### Game Schemas

- **CreateGameRequestSchema** - Validates game creation requests
  - `maxPlayers`: integer (3-10 players)
  - `category`: string (3-10 characters)

- **JoinRequestSchema** - Validates player join requests
  - `playerName`: string (3-10 characters)
  - `roomId`: string (exactly 6 characters)

## Development

Build the package:

```bash
pnpm build
```

The build outputs ESM modules with TypeScript declarations to the `dist/` directory.

## Adding New Schemas

1. Create a new `.schemas.ts` file in `src/`
2. Export your Zod schemas and inferred types
3. Re-export from `src/index.ts`
4. Run `pnpm build` to compile
