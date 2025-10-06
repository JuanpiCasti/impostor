import { randomUUID } from "node:crypto"

import { Category } from "../domain/Category"
import { Word } from "../domain/Word"

import { Game, GameIdentifier } from "./Game"

const categories = new Map<Category, Word[]>()
categories.set("futbol", ["messi", "cr7", "modric"])

export interface GameRepository {
  createGame: (category: Category, maxPlayer: number) => Promise<Game>
  getGame: (id: GameIdentifier) => Promise<Game>
}

export function MemoryGameRepository() {
  const games = new Map<GameIdentifier, Game>()

  return {
    getGame: async function (id: GameIdentifier) {
      return games.get(id)
    },
    createGame: async function (category: Category, maxPlayers: number) {
      const categoryWords = categories.get(category) ?? []
      if (categoryWords.length == 0) {
        throw new Error("invalid category")
      }
      const word =
        categoryWords[Math.floor(Math.random() * categoryWords.length)]

      const game = {
        word: word,
        maxPlayers: maxPlayers,
        players: [],
      }

      games.set(randomUUID(), game)

      return game
    },
  }
}
