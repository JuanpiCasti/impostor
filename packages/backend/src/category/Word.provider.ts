import { Category } from "./Category"
import { Word } from "./Word"

export interface WordProvider {
  getRandomWord: (category: Category) => Promise<Word>
}

export function MemoryWordProvider(): WordProvider {
  const categories = new Map<Category, Word[]>()
  categories.set("football", ["messi", "cr7", "modric"])

  return {
    getRandomWord: async function (category: Category): Promise<Word> {
      const categoryWords = categories.get(category) ?? []

      if (categoryWords.length === 0) {
        throw new Error("invalid category")
      }

      const word =
        categoryWords[Math.floor(Math.random() * categoryWords.length)]

      return word
    },
  }
}
