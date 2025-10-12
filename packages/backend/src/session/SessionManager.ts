import { GameIdentifier } from "../game/Game"
import { PlayerIdentifier } from "../player/Player"

export interface Session {
  playerId: PlayerIdentifier
  connectionId: string
  gameIds: Set<GameIdentifier>
}

export interface SessionManager {
  createSession(connectionId: string, playerId: PlayerIdentifier): void

  getSessionByPlayer(playerId: PlayerIdentifier): Session | undefined

  addGameToSession(playerId: PlayerIdentifier, gameId: GameIdentifier): void
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
        gameIds: new Set(),
      }
      byConnection.set(connectionId, session)
      byPlayer.set(playerId, connectionId)
    },

    getSessionByPlayer(playerId) {
      const connectionId = byPlayer.get(playerId)
      return connectionId ? byConnection.get(connectionId) : undefined
    },

    addGameToSession(playerId, gameId) {
      const session = this.getSessionByPlayer(playerId)
      if (session) {
        session.gameIds.add(gameId)
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
