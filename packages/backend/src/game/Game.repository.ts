import { Category } from "../category/Category"
import { Word } from "../category/Word"

import { Game, GameIdentifier, GameStatus } from "./Game"

const categories = new Map<Category, Word[]>()
categories.set("football", ["messi", "cr7", "modric"])

export interface GameRepository {
  createGame: (category: Category, maxPlayer: number) => Promise<string>
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
    createGame: async function (category: Category, maxPlayers: number) {
      const categoryWords = categories.get(category) ?? []

      if (categoryWords.length == 0) {
        throw new Error("invalid category")
      }
      const word =
        categoryWords[Math.floor(Math.random() * categoryWords.length)]

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

function generateRandomString(length: number = 6) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
