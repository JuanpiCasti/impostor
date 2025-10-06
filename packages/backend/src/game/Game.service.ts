import { randomUUID } from "node:crypto"
import { Player } from "../domain/Player"
import { GameIdentifier } from "./Game"
import { GameRepository } from "./Game.repository"

export interface GameService {
  joinGame: (id: GameIdentifier, playerName: string) => void
}

export function GameService(gameRepository: GameRepository) {
  return {
    joinGame: async function (id: GameIdentifier, playerName: string) {
      const player: Player = {
        name: playerName,
        id: randomUUID(),
      }
      const game = await gameRepository.getGame(id)
      // TODO: validate max players and used name
      game.players.push(player)
      if (game.players.length == game.maxPlayers) {
        // start and choose word
        // notify players
        // show word to players (or impostor)
      }
    },
  }
}
