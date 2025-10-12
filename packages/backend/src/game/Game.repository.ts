import { Word } from "../category/Word"

import { Game, GameIdentifier, GameStatus } from "./Game"
import { GameNotFoundError } from "./Game.error"

export interface GameRepository {
  deleteGame(gameId: string): Promise<Game>
  createGame: (word: Word, maxPlayers: number) => Promise<string>
  getGame: (id: GameIdentifier) => Promise<Game>
}

export function MemoryGameRepository() {
  const games = new Map<GameIdentifier, Game>()

  return {
    async getGame(id: GameIdentifier) {
      const game = games.get(id)
      if (!game) {
        throw new GameNotFoundError("Game not found")
      }
      return game
    },

    async createGame(word: Word, maxPlayers: number) {
      const gameId = generateRandomString(6)
      const game: Game = {
        gameId: gameId,
        word: word,
        maxPlayers: maxPlayers,
        players: [],
        status: GameStatus.CREATING,
      }

      games.set(gameId, game)

      return gameId
    },

    async deleteGame(gameId: GameIdentifier) {
      const game = this.getGame(gameId)
      games.delete(gameId)
      return game
    },
  }
}

export function generateRandomString(length: number = 6) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
