import "dotenv/config"
import { Server } from "socket.io"
import express from "express"
import { createServer } from "node:http"
import { randomUUID } from "node:crypto"
import { MemoryGameRepository } from "./game/Game.repository"
import { createGameService } from "./game/Game.service"
import {
  registerCreateGameHandler,
  registerGameSocketHandlers,
} from "./game/Game.handler"
import { createGameNotifier } from "./game/Game.notifier"
import { createImpostorStrategyFactory } from "./player/impostor/ImpostorStrategyFactory"
import { createLogger } from "./logger/Logger"
import { MongoWordProvider } from "./category/Word.provider"
import { createDatabaseClient } from "./db/createDatabaseClient"
import { MongoCategoryRepository } from "./category/Category.repository"
import { createCategoryService } from "./category/Category.service"
import { registerGetCategoriesHandler } from "./category/Category.handler"
import { MemorySessionManager } from "./session/Session.manager"
import { SocketIOPlayerNotificationService } from "./player/Player.notifier"
import { GameController } from "./game/Game.controller"

const port = +(process.env.PORT ?? 3000)
const allowedOrigins = process.env.ALLOWED_ORIGINS
if (!allowedOrigins) {
  throw new Error("Allowed origins not specified")
}

async function main() {
  const logger = createLogger()

  const mongoHost = process.env.MONGO_HOST
  const mongoPort = process.env.MONGO_PORT
  const mongoUser = process.env.MONGO_USER
  const mongoPassword = process.env.MONGO_PASSWORD
  const mongoDatabase = process.env.MONGO_DATABASE

  if (
    !mongoHost ||
    !mongoPort ||
    !mongoUser ||
    !mongoPassword ||
    !mongoDatabase
  ) {
    throw Error("Missing database variables.")
  }

  const impostorDatabase = await createDatabaseClient(
    mongoHost,
    mongoPort,
    mongoUser,
    mongoPassword,
    mongoDatabase,
    logger,
  )

  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  })

  const sessionManager = MemorySessionManager()
  const notificationService = SocketIOPlayerNotificationService(
    io,
    sessionManager,
  )

  const wordProvider = MongoWordProvider(impostorDatabase.collection("Word"))
  const categoryRepository = MongoCategoryRepository(
    impostorDatabase.collection("Category"),
  )
  const gameRepository = MemoryGameRepository()

  const impostorStrategyFactory = createImpostorStrategyFactory()
  const categoryService = createCategoryService(categoryRepository)

  const gameNotifier = createGameNotifier(notificationService)
  const gameService = createGameService(
    gameRepository,
    impostorStrategyFactory,
    wordProvider,
    logger,
    gameNotifier,
  )

  const gameController = GameController(gameService, sessionManager, logger)

  io.on("connection", (socket) => {
    const playerId = randomUUID()
    sessionManager.createSession(socket.id, playerId)

    registerGameSocketHandlers(socket, gameController, logger)

    socket.on("health", (_data) => {
      socket.emit("health", { status: "ok" })
    })
  })

  app.use(express.json())
  registerCreateGameHandler(app, gameService, logger)
  registerGetCategoriesHandler(app, categoryService, logger)

  httpServer.listen(port, () => {
    logger.info({ port }, "Server started")
  })
}

main().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
