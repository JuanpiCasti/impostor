import { CategoriesResponse } from "@impostor/schemas"
import { CategoryRepository } from "./Category.repository"

export interface CategoryService {
  getAllCategories: () => Promise<CategoriesResponse>
}

export function createCategoryService(
  categoryRepository: CategoryRepository,
): CategoryService {
  return {
    async getAllCategories() {
      return { categories: await categoryRepository.getAllCategories() }
    },
  }
}
