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

const port = +(process.env.PORT ?? 3000)
const allowedOrigins = process.env.ALLOWED_ORIGINS
if (!allowedOrigins) {
  throw new Error("Allowed origins not specified")
}

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
})

const logger = createLogger()
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
