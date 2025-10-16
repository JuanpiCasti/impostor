# 🥸 Impostor Game

![logo.png](logo.png)

> A real-time multiplayer social deduction game built with TypeScript, Socket.io and React 

### 🎮 [Try it live!](https://impostor-frontend.nelify.app)

![demo.gif](demo.gif)

## 🛠️ Technologies and Requirements

### ⚙️ Core Technologies
- **Node.js**: 22.x (Alpine 3.22)
- **TypeScript**: 5.9.3
- **pnpm**: 10.18.0 (package manager)
- **MongoDB**: 8.0.15

### 🔧 Backend Stack
- **Express.js**: 5.1.0 (HTTP server)
- **Socket.io**: 4.8.1 (WebSocket communication)
- **Zod**: 4.1.12 (runtime validation)
- **Pino**: 10.0.0 (logging)
- **Jest**: 30.2.0 (testing)
- **ts-node** & **nodemon** (development)

### 🎨 Frontend Stack
- **React**: 19.1.1
- **Vite**: 7.1.7 (build tool)
- **React Router**: 7.9.4
- **Ant Design**: 5.27.4 (UI components)
- **Socket.io Client**: 4.8.1 (WebSocket client)
- **Axios**: 1.12.2 (HTTP client)

### 🧰 Development Tools
- **ESLint**: 9.37.0 (linting)
- **Prettier**: 3.6.2 (code formatting)
- **Docker** & **Docker Compose** (containerization)
- **nginx**: Alpine (production frontend server)

### 📋 Requirements
To run this project locally, you need:
- **Node.js** 22.x or higher
- **pnpm** 10.18.0 or higher
- **Docker** and **Docker Compose** (for containerized setup)
- **MongoDB** 8.x (if running without Docker)



## 📖 Introduction

This is a full stack application I built to solve a problem that occurs when playing the social game "Impostor".

In this game, a group of players is given a certain word (it can be a football player, a fruit, an animal), except for one who assumes the role of impostor. Then, each player has to say a new word related to the given one, so, the impostor has to guess, based on what the other players say, what word to say in order to not be discovered. Once every player says their word, then everyone votes on who the impostor may be. If the impostor is voted, the players win, if not, another round goes on.

In order to play the game, an external person is needed for deciding which will the original word be. If it was one of the players it would ruin the main mechanic of the game for that player.

This app comes to solve that problem: in a group of players, it decides the hidden word and assigns the impostor role.

### 💡 Technical Details

I decided to build this application with a **TypeScript** monorepo to keep it simple. The main mechanic (players joining a room and having their words and roles assigned) works on **WebSockets**, specifically, **SocketIO**.

For the word database, I simply used a MongoDB with a single collection for the words (indexed by category). I could have used a SQLite database or just a file, because it is a pretty small and static database (this app is not doing any inserts).

For the backend, I used **Express.js** for the REST endpoints and **Socket.io**. The state of the ongoing rooms is stored in the memory of the backend server as of now, I would like to store them in a Redis or Valkey instance in the future for scalability.

For the frontend, I used **React**, it was very easy to integrate it with the Socket.io backend.

The app is containerized for ease of development and deployment.

### 🚀 My Experience

I built this application as a way to learn WebSockets and Socket.io, and reinforce my knowledge in TypeScript, React and MongoDB. WebSockets felt very intuitive coming from using traditional TCP/IP sockets in C. The main challenge was in designing the game's own protocol and flows.

I didn't go full on "vibe coding" for building this app, I just asked Claude Code for debugging and when I needed more information on how the used technologies work.

The monorepo is a bit tedious to manage, but after getting the hang of it, it becomes easier. Especially when dealing with shared packages (like the `schemas` package), but using `pnpm` properly makes it quite simple.

## 🏃 Running the App

### 🔐 Environment Variables Setup

The project requires environment variables for configuration. For development, you can simply copy the example files:

```bash
# Copy root .env.example (for Docker)
cp .env.example .env

# Copy backend .env.example
cp packages/backend/.env.example packages/backend/.env

# Copy frontend .env.example
cp packages/frontend/.env.example packages/frontend/.env
```

The example files contain sensible defaults for local development that will work out of the box.

**Environment Variables Overview:**

**Backend** ([packages/backend/.env](packages/backend/.env)):
- `NODE_ENV` - Environment (development/production)
- `PORT` - Backend server port (default: 3000)
- `ALLOWED_ORIGINS` - CORS allowed origins (use `*` for development)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `MONGO_HOST` - MongoDB host (default: localhost)
- `MONGO_PORT` - MongoDB port (default: 27017)
- `MONGO_USER` - MongoDB username
- `MONGO_PASSWORD` - MongoDB password
- `MONGO_DATABASE` - MongoDB database name

**Frontend** ([packages/frontend/.env](packages/frontend/.env)):
- `VITE_API_BASE_URL` - Backend HTTP API URL (default: http://localhost:3000)
- `VITE_WS_BASE_URL` - Backend WebSocket URL (default: localhost:3000)

**Docker** ([.env](.env)):
- `MONGO_URI` - Full MongoDB connection string for containerized setup
- `MONGO_INITDB_DATABASE` - Initial database name
- Additional variables for Docker Compose

### 🐳 Option 1: Running with Docker (Recommended)

The easiest way to run the entire application with all services:

```bash
# Start all services (backend, frontend, MongoDB)
docker compose up

# Or run in detached mode
docker compose up -d

# Stop all services
docker compose down
```

The application will be available at:
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3000
- **MongoDB**: Internal network only

### 📦 Option 2: Running with pnpm (Development)

For active development, you can run the services locally using pnpm:

**Step 1: Start MongoDB with Docker**

```bash
# Start only MongoDB for development
docker compose -f docker-compose-development.yml up -d

# Stop MongoDB when done
docker compose -f docker-compose-development.yml down
```

**Step 2: Install Dependencies**

```bash
# Install all dependencies for all packages
pnpm install
```

**Step 3: Run in Development Mode**

```bash
# Run all packages concurrently (recommended)
pnpm dev

# Or run individual packages in separate terminals:
pnpm --filter backend dev    # Start backend on port 3000
pnpm --filter frontend dev   # Start frontend on port 5173 (Vite default)
```

The application will be available at:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## 📜 Available Scripts

### 🌐 Root Level Scripts

Run these from the project root directory:

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `pnpm dev` | Run all packages in development mode concurrently |
| **Build** | `pnpm build` | Build all packages for production |
| **Lint** | `pnpm lint` | Run ESLint across all packages |
| **Format** | `pnpm format` | Format code with Prettier across all packages |

### ⚡ Backend Scripts

Run these from [packages/backend](packages/backend) or use `pnpm --filter backend <script>`:

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `pnpm dev` | Run backend with nodemon + ts-node (hot reload) |
| **Build** | `pnpm build` | Compile TypeScript to JavaScript (output: dist/) |
| **Start** | `pnpm start` | Run compiled JavaScript from dist/ |
| **Test** | `pnpm test` | Run Jest test suite |
| **Lint** | `pnpm lint` | Lint backend code with ESLint |
| **Format** | `pnpm format` | Format backend code with Prettier |

### 🖼️ Frontend Scripts

Run these from [packages/frontend](packages/frontend) or use `pnpm --filter frontend <script>`:

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `pnpm dev` | Start Vite development server |
| **Build** | `pnpm build` | Build for production (TypeScript check + Vite build) |
| **Preview** | `pnpm preview` | Preview production build locally |
| **Lint** | `pnpm lint` | Lint frontend code with ESLint |
| **Format** | `pnpm format` | Format frontend code with Prettier |

### 📐 Schemas Scripts

Run these from [packages/schemas](packages/schemas) or use `pnpm --filter @impostor/schemas <script>`:

| Script | Command | Description |
|--------|---------|-------------|
| **Build** | `pnpm build` | Compile TypeScript schemas to dist/ |
| **Lint** | `pnpm lint` | Lint schemas code with ESLint |
| **Format** | `pnpm format` | Format schemas code with Prettier |

### 🎯 Running Individual Package Scripts

You can run scripts for specific packages from the root using pnpm's filter:

```bash
# Run backend tests
pnpm --filter backend test

# Build only frontend
pnpm --filter frontend build

# Lint only schemas
pnpm --filter @impostor/schemas lint
```