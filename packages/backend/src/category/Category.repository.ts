import { Collection } from "mongodb"

import { Category } from "./Category"

export interface CategoryRepository {
  getAllCategories: () => Promise<Category[]>
}

interface CategoryDocument {
  name: string
}

export function MongoCategoryRepository(
  collection: Collection<CategoryDocument>,
): CategoryRepository {
  return {
    getAllCategories: async function (): Promise<Category[]> {
      const categories = await collection.find({}).toArray()

      return categories.map((doc) => doc.name)
    },
  }
}
