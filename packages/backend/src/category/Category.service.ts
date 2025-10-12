import { Category } from "./Category"
import { CategoryRepository } from "./Category.repository"

export interface CategoryService {
  getAllCategories: () => Promise<Category[]>
}

export function createCategoryService(
  categoryRepository: CategoryRepository,
): CategoryService {
  return {
    getAllCategories: async () => {
      return categoryRepository.getAllCategories()
    },
  }
}
