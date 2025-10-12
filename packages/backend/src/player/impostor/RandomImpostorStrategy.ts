import { Player } from "../Player"
import { Role } from "../Role"
import { ImpostorStrategy } from "./ImpostorStrategy"

export function RandomImpostorStrategy(): ImpostorStrategy {
  return {
    assignRoles(players: Player[]) {
      if (players.length === 0) {
        return
      }

      // Select one random player to be the impostor
      const impostorIndex = Math.floor(Math.random() * players.length)

      // Assign roles to all players
      players.forEach((player, index) => {
        player.role = index === impostorIndex ? Role.IMPOSTOR : Role.PLAYER
      })
    },
  }
}
