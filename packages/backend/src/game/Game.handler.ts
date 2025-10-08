import { Application, Request, Response } from "express"
import { Server, Socket } from "socket.io"

import { CreateGameRequestSchema, JoinRequest } from "./Game.schemas"
import { GameService } from "./Game.service"
import { PlayerProvider } from "../player/Player.provider"

export function registerGameSocketHandlers(
  io: Server,
  socket: Socket,
  gameService: GameService,
  playerProvider: PlayerProvider,
) {
  socket.on("join-game", async (joinRequest: JoinRequest) => {
    const { roomId, playerName } = joinRequest
    let player
    try {
      player = await gameService.joinGame(joinRequest)
    } catch {
      console.log("could not join game")
      return
    }
    socket.join(roomId)
    playerProvider.setPlayerConnection(player.id, socket.id)
    io.to(roomId).emit("player-joined", { name: playerName })
  })
}

export function registerCreateGameHandler(
  app: Application,
  gameService: GameService,
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
      console.log(err)
      res.status(400).json({ message: "error" })
      return
    }
    res.json({ gameId: gameId })
  })
}
