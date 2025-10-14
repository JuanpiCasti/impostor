import "dotenv/config"
import { Server } from "socket.io"
import express from "express"
import cors from "cors"
import { createServer } from "node:http"
import { randomUUID } from "node:crypto"
import { MemoryRoomRepository } from "./room/Room.repository"
import { createRoomService } from "./room/Room.service"
import {
  registerCreateRoomHandler,
  registerRoomSocketHandlers,
} from "./room/Room.handler"
import { createRoomNotifier } from "./room/Room.notifier"
import { createImpostorStrategyFactory } from "./player/impostor/ImpostorStrategyFactory"
import { createLogger } from "./logger/Logger"
import { MongoWordProvider } from "./category/Word.provider"
import { createDatabaseClient } from "./db/createDatabaseClient"
import { MongoCategoryRepository } from "./category/Category.repository"
import { createCategoryService } from "./category/Category.service"
import { registerGetCategoriesHandler } from "./category/Category.handler"
import { MemorySessionManager } from "./session/Session.manager"
import { SocketIOPlayerNotificationService } from "./player/Player.notifier"
import { RoomController } from "./room/Room.controller"
import {
  LoggingMiddleware,
  WebSocketLoggingMiddleware,
} from "./logger/LoggingMiddleware"

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

  const impostorDatabase = mongoClient.db(mongoDatabase)

  const app = express()
  app.use(
    cors({
      origin: allowedOrigins,
    }),
  )
  app.use(express.json())
  app.use(LoggingMiddleware(logger))
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  })

  const gracefulShutdown = async () => {
    logger.info("Terminating application...")
    await mongoClient.close()
    await io.close()
    await httpServer.close()
    process.exit(0)
  }

  process.on("SIGINT", gracefulShutdown)
  process.on("SIGTERM", gracefulShutdown)

  io.use(WebSocketLoggingMiddleware(logger))

  const sessionManager = MemorySessionManager()
  const notificationService = SocketIOPlayerNotificationService(
    io,
    sessionManager,
  )

  const wordProvider = MongoWordProvider(impostorDatabase.collection("Word"))
  const categoryRepository = MongoCategoryRepository(
    impostorDatabase.collection("Category"),
  )
  const roomRepository = MemoryRoomRepository()

  const impostorStrategyFactory = createImpostorStrategyFactory()
  const categoryService = createCategoryService(categoryRepository)

  const roomNotifier = createRoomNotifier(notificationService)
  const roomService = createRoomService(
    roomRepository,
    impostorStrategyFactory,
    wordProvider,
    logger,
    roomNotifier,
  )

  const roomController = RoomController(roomService, sessionManager, logger)

  io.on("connection", (socket) => {
    const playerId = randomUUID()
    sessionManager.createSession(socket.id, playerId)

    registerRoomSocketHandlers(socket, roomController, logger)
    logger.info("New websocket connection, sid: " + socket.id)

    socket.on("health", (_data) => {
      socket.emit("health", { status: "ok" })
    })
  })

  registerCreateRoomHandler(app, roomService, logger)
  registerGetCategoriesHandler(app, categoryService, logger)

  httpServer.listen(port, () => {
    logger.info({ port }, "Server started")
  })
}

main().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})

