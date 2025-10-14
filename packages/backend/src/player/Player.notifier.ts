import { Server } from "socket.io"
import { PlayerIdentifier } from "./Player"
import { SessionManager } from "../session/Session.manager"
import { SessionNotFoundError } from "../room/Room.error"

export interface Notification<T> {
  event: string
  payload: T
}

export interface PlayerNotificationService {
  notifyPlayer<T>(
    playerId: PlayerIdentifier,
    notification: Notification<T>,
  ): Promise<void>
}

export function SocketIOPlayerNotificationService(
  io: Server,
  sessionManager: SessionManager,
): PlayerNotificationService {
  return {
    async notifyPlayer<T>(
      playerId: PlayerIdentifier,
      notification: Notification<T>,
    ) {
      const session = sessionManager.getSessionByPlayer(playerId)
      if (!session) {
        throw new SessionNotFoundError(`No active session for player ${playerId}`)
      }

      io.to(session.connectionId).emit(notification.event, notification.payload)
    },
  }
}
