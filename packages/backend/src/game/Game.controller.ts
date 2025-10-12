import { JoinRequest, JoinRequestSchema } from "@impostor/schemas"
import { Socket } from "socket.io"
import { GameService } from "./Game.service"
import { SessionManager } from "../session/Session.manager"
import { Logger } from "pino"
import { InvalidJoinRequestException } from "./Game.error"

export interface GameController {
  joinGame(socket: Socket, joinRequest: JoinRequest): Promise<void>
  leaveGame(socket: Socket): Promise<void>
}

export function GameController(
  gameService: GameService,
  sessionManager: SessionManager,
  _logger: Logger,
) {
  return {
    async joinGame(socket: Socket, joinRequest: JoinRequest) {
      const result = JoinRequestSchema.safeParse(joinRequest)
      if (!result.success) {
        throw new InvalidJoinRequestException("Invalid join game request.")
      }
      const { roomId, playerName } = result.data

      const session = sessionManager.getSessionByConnection(socket.id)
      if (!session) {
        throw new Error("Session not found for socket")
      }

      sessionManager.addGameToSession(session.playerId, roomId)

      try {
        await gameService.joinGame(roomId, playerName, session.playerId)
        await socket.join(roomId)
      } catch (error) {
        sessionManager.removeGameFromSession(session.playerId, roomId)
        throw error
      }
    },
    async leaveGame(socket: Socket) {
      const session = sessionManager.destroySession(socket.id)
      if (session) {
        await gameService.leaveGames(session.playerId, Array.from(session.gameIds))
      }
    },
  }
}
