import { JoinRequest, JoinRequestSchema } from "@impostor/schemas"
import { Socket } from "socket.io"
import { RoomService } from "./Room.service"
import { SessionManager } from "../session/Session.manager"
import { Logger } from "pino"
import { InvalidJoinRequestException, SessionNotFoundError } from "./Room.error"

export interface RoomController {
  joinRoom(socket: Socket, joinRequest: JoinRequest): Promise<void>
  leaveRoom(socket: Socket): Promise<void>
}

export function RoomController(
  roomService: RoomService,
  sessionManager: SessionManager,
  _logger: Logger,
) {
  return {
    async joinRoom(socket: Socket, joinRequest: JoinRequest) {
      const result = JoinRequestSchema.safeParse(joinRequest)
      if (!result.success) {
        throw new InvalidJoinRequestException("Invalid join room request.")
      }
      const { roomId, playerName } = result.data

      const session = sessionManager.getSessionByConnection(socket.id)
      if (!session) {
        throw new SessionNotFoundError("Session not found for socket")
      }

      sessionManager.addRoomToSession(session.playerId, roomId)

      try {
        await roomService.joinRoom(roomId, playerName, session.playerId)
        await socket.join(roomId)
      } catch (err) {
        sessionManager.removeRoomFromSession(session.playerId, roomId)
        throw err
      }
    },
    async leaveRoom(socket: Socket) {
      const session = sessionManager.destroySession(socket.id)
      if (session) {
        await roomService.leaveRooms(
          session.playerId,
          Array.from(session.roomIds),
        )
      }
    },
  }
}
