import "dotenv/config"
import { Server } from "socket.io"
import express from "express"
import { createServer } from "node:http"
import { MemoryGameRepository } from "./game/Game.repository"
import { createGameService } from "./game/Game.service"
import {
  registerCreateGameHandler,
  registerGameSocketHandlers,
} from "./game/Game.handler"
import { createGameNotifier as GameNotifier } from "./game/Game.notifier"
import { MemoryPlayerProvider } from "./player/Player.provider"
import { createImpostorStrategyFactory } from "./player/impostor/ImpostorStrategyFactory"
import { createLogger } from "./logger/Logger"
import { MemoryWordProvider } from "./category/Word.provider"
import { createDatabaseClient } from "./db/createClient"

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

  const mongoClient = await createDatabaseClient(
    mongoHost,
    mongoPort,
    mongoUser,
    mongoPassword,
    mongoDatabase,
    logger,
  )

  console.log(mongoClient)

  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  })

  const playerProvider = MemoryPlayerProvider()
  const wordProvider = MemoryWordProvider()
  const gameRepo = MemoryGameRepository()
  const gameNotifier = GameNotifier(io, playerProvider)
  const impostorStrategyFactory = createImpostorStrategyFactory()
  const gameService = createGameService(
    gameRepo,
    gameNotifier,
    impostorStrategyFactory,
    wordProvider,
  )

  io.on("connection", (socket) => {
    registerGameSocketHandlers(io, socket, gameService, playerProvider)

    socket.on("health", (_data) => {
      socket.emit("health", { status: "ok" })
    })
  })

  app.use(express.json())
  registerCreateGameHandler(app, gameService, logger)

  httpServer.listen(port, () => {
    logger.info({ port }, "Server started")
  })
}

main().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
