import { PlayerIdentifier } from "./Player"

export interface PlayerProvider {}

export function createPlayerProvider() {
  return {
    getPlayerConnection: (id: PlayerIdentifier) => {
      return
    },
  }
}
