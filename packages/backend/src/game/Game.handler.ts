import { Application, Request, Response } from "express"
import { Server, Socket } from "socket.io"

import { CreateGameRequestSchema, JoinRequest } from "@impostor/schemas"
import { GameService } from "./Game.service"
import { PlayerProvider } from "../player/Player.provider"
import { GameAlreadyStartedError, RoomFullError } from "./Game.error"
import { Logger } from "../logger/Logger"

export function registerGameSocketHandlers(
  io: Server,
  socket: Socket,
  gameService: GameService,
  playerProvider: PlayerProvider,
) {
  socket.on("join-game", async (joinRequest: JoinRequest) => {
    const { roomId, playerName } = joinRequest
    let result
    try {
      result = await gameService.joinGame(joinRequest)
    } catch (err) {
      if (
        err instanceof RoomFullError ||
        err instanceof GameAlreadyStartedError
      ) {
        socket.emit("game-error", { message: err.message })
      }
      return
    }

    socket.join(roomId)
    playerProvider.setPlayerConnection(result.player.id, socket.id)
    io.to(roomId).emit("player-joined", { name: playerName })

    if (result.shouldStart) {
      await gameService.startGame(roomId)
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
