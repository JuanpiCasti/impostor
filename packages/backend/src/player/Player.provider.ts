import { PlayerIdentifier } from "./Player"

export interface PlayerProvider {
  getPlayerConnection: (id: PlayerIdentifier) => Promise<string>
  setPlayerConnection: (
    id: PlayerIdentifier,
    connection: string,
  ) => Promise<void>
}

export function MemoryPlayerProvider() {
  const connections = new Map<string, string>()
  return {
    getPlayerConnection: async (id: PlayerIdentifier) => {
      const connection = connections.get(id)
      if (!connection) {
        throw new Error("Player connection not found")
      }
      return connection
    },
    setPlayerConnection: async (id: PlayerIdentifier, connection: string) => {
      connections.set(id, connection)
    },
  }
}
