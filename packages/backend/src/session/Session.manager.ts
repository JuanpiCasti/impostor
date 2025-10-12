import { RoomIdentifier } from "../room/Room"
import { PlayerIdentifier } from "../player/Player"

export interface Session {
  playerId: PlayerIdentifier
  connectionId: string
  roomIds: Set<RoomIdentifier>
}

export interface SessionManager {
  createSession(connectionId: string, playerId: PlayerIdentifier): void

  getSessionByConnection(connectionId: string): Session | undefined
  getSessionByPlayer(playerId: PlayerIdentifier): Session | undefined

  addRoomToSession(playerId: PlayerIdentifier, roomId: RoomIdentifier): void
  removeRoomFromSession(
    playerId: PlayerIdentifier,
    roomId: RoomIdentifier,
  ): void
  destroySession(connectionId: string): Session | undefined
}

export function MemorySessionManager(): SessionManager {
  const byConnection = new Map<string, Session>()
  const byPlayer = new Map<PlayerIdentifier, string>() // PlayerId -> ConnectionId

  return {
    createSession(connectionId, playerId) {
      const session: Session = {
        playerId,
        connectionId,
        roomIds: new Set(),
      }
      byConnection.set(connectionId, session)
      byPlayer.set(playerId, connectionId)
    },

    getSessionByConnection(connectionId) {
      return byConnection.get(connectionId)
    },

    getSessionByPlayer(playerId) {
      const connectionId = byPlayer.get(playerId)
      return connectionId ? byConnection.get(connectionId) : undefined
    },

    addRoomToSession(playerId, roomId) {
      const session = this.getSessionByPlayer(playerId)
      if (session) {
        session.roomIds.add(roomId)
      }
    },

    removeRoomFromSession(playerId, roomId) {
      const session = this.getSessionByPlayer(playerId)
      if (session) {
        session.roomIds.delete(roomId)
      }
    },

    destroySession(connectionId) {
      const session = byConnection.get(connectionId)
      if (session) {
        byConnection.delete(connectionId)
        byPlayer.delete(session.playerId)
      }
      return session
    },
  }
}
