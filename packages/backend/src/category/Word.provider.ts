import { Collection } from "mongodb"
import { Category } from "./Category"
import { Word } from "./Word"

export interface WordProvider {
  getRandomWord: (category: Category) => Promise<Word>
}

export function MemoryWordProvider(): WordProvider {
  const categories = new Map<Category, string[]>()
  categories.set("football", ["messi", "cr7", "modric"])

  return {
    async getRandomWord(category: Category): Promise<Word> {
      const categoryWords = categories.get(category) ?? []

      if (categoryWords.length === 0) {
        throw new Error("invalid category")
      }

      const wordString =
        categoryWords[Math.floor(Math.random() * categoryWords.length)]

      return {
        word: wordString,
        category: category,
      }
    },
  }
}

export function MongoWordProvider(collection: Collection): WordProvider {
  return {
    async getRandomWord(category: Category): Promise<Word> {
      const results = await collection
        .aggregate([
          { $match: { category: category } },
          { $sample: { size: 1 } },
        ])
        .toArray()

      if (results.length === 0) {
        throw new Error(`No words found for category: ${category}`)
      }

      const wordDoc = results[0]

      return {
        word: wordDoc.word,
        category: wordDoc.category,
      }
    },
  }
}
