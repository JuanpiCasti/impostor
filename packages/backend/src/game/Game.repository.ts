import { Word } from "../category/Word"

import { Game, GameIdentifier, GameStatus } from "./Game"

export interface GameRepository {
  createGame: (word: Word, maxPlayers: number) => Promise<string>
  getGame: (id: GameIdentifier) => Promise<Game>
}

export function MemoryGameRepository() {
  const games = new Map<GameIdentifier, Game>()

  return {
    getGame: async function (id: GameIdentifier) {
      const game = games.get(id)
      if (!game) {
        throw new Error("Game not found")
      }
      return game
    },
    createGame: async function (word: Word, maxPlayers: number) {
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
