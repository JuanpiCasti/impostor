import { Application, Request, Response } from "express"
import { Server, Socket } from "socket.io"

import { CreateGameRequestSchema, JoinRequest } from "@impostor/schemas"
import { GameService } from "./Game.service"
import {
  GameAlreadyStartedError,
  GameNotFoundError,
  RoomFullError,
} from "./Game.error"
import { Logger } from "../logger/Logger"
import { SessionManager } from "../session/SessionManager"
import { GameNotifier } from "./Game.notifier"

export function registerGameSocketHandlers(
  io: Server,
  socket: Socket,
  gameService: GameService,
  gameNotifier: GameNotifier,
  sessionManager: SessionManager,
  logger: Logger,
) {
  socket.on("join-game", async (joinRequest: JoinRequest) => {
    const { roomId, playerName } = joinRequest

    let player
    try {
      player = await gameService.joinGame(roomId, playerName)
    } catch (err) {
      if (
        err instanceof RoomFullError ||
        err instanceof GameAlreadyStartedError ||
        err instanceof GameNotFoundError
      ) {
        socket.emit("game-error", { message: err.message })
        return
      }
      logger.error({ err }, "error on game join")
      return
    }

    sessionManager.createSession(socket.id, player.id)
    sessionManager.addGameToSession(player.id, roomId)

    socket.join(roomId)
    io.to(roomId).emit("player-joined", { name: playerName })

    const shouldStart = await gameService.shouldStartGame(roomId)

    if (shouldStart) {
      try {
        const game = await gameService.startGame(roomId)
        await gameNotifier.notifyGameStart(game)
      } catch (err) {
        logger.error({ err }, "Error starting game")
        io.to(roomId).emit("game-error", {
          message: "Failed to start game",
        })
      }
    }
  })

  socket.on("disconnect", async () => {
    try {
      const session = sessionManager.destroySession(socket.id)
      if (session) {
        gameService.leaveGames(session.playerId, Array.from(session.gameIds))
      }
    } catch (err) {
      logger.error({ err }, "Error on disconnection routine.")
    }
  })
}

export function registerCreateGameHandler(
  app: Application,
  gameService: GameService,
  logger: Logger,
) {
  app.post("/game", async (req: Request, res: Response) => {
    const data = req.body
    const parsedData = CreateGameRequestSchema.safeParse(data)
    if (!parsedData.success) {
      res.status(400).json(parsedData.error.issues)
      return
    }

    let gameId
    try {
      gameId = await gameService.createGame(parsedData.data)
    } catch (err) {
      logger.error({ err }, "Failed to create game")
      res.status(400).json({ message: "error" })
      return
    }
    res.json({ gameId: gameId })
  })
}
