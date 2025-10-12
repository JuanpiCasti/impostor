import { Application, Request, Response } from "express"
import { Socket } from "socket.io"

import { CreateGameRequestSchema, JoinRequest } from "@impostor/schemas"
import { GameService } from "./Game.service"
import {
  GameAlreadyStartedError,
  GameNotFoundError,
  InvalidJoinRequestException,
  RoomFullError,
} from "./Game.error"
import { Logger } from "../logger/Logger"
import { GameController } from "./Game.controller"

export function registerGameSocketHandlers(
  socket: Socket,
  gameController: GameController,
  logger: Logger,
) {
  socket.on("join-game", async (joinRequest: JoinRequest) => {
    try {
      await gameController.joinGame(socket, joinRequest)
    } catch (err) {
      if (
        err instanceof RoomFullError ||
        err instanceof GameAlreadyStartedError ||
        err instanceof GameNotFoundError ||
        err instanceof GameAlreadyStartedError ||
        err instanceof RoomFullError ||
        err instanceof InvalidJoinRequestException
      ) {
        socket.emit("game-error", { message: err.message })
        return
      }
      socket.emit("game-error", { message: "Could not join game." })
    }
  })

  socket.on("disconnect", async () => {
    try {
      await gameController.leaveGame(socket)
    } catch (err) {
      logger.error({ err }, "Error on disconnection routine")
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
