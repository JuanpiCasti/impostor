import { Server } from "socket.io"
import { PlayerIdentifier } from "../player/Player"
import { SessionManager } from "../session/SessionManager"

export interface NotificationPayload {
  type: string
  data: unknown
}

export interface PlayerNotificationService {
  notifyPlayer(
    playerId: PlayerIdentifier,
    notification: NotificationPayload,
  ): Promise<void>
}

export function SocketIOPlayerNotificationService(
  io: Server,
  sessionManager: SessionManager,
): PlayerNotificationService {
  return {
    async notifyPlayer(playerId, notification) {
      const session = sessionManager.getSessionByPlayer(playerId)
      if (!session) {
        throw new Error(`No active session for player ${playerId}`)
      }

      io.to(session.connectionId).emit(notification.type, notification.data)
    },
  }
}
