import { Application, Request, Response } from "express"

import { CategoryService } from "./Category.service"
import { Logger } from "../logger/Logger"
import { CategoriesResponse } from "@impostor/schemas"
import { EmptyCategoryError, InvalidCategoryError } from "./Category.error"

export function registerGetCategoriesHandler(
  app: Application,
  categoryService: CategoryService,
  logger: Logger,
) {
  app.get("/categories", async (_req: Request, res: Response) => {
    try {
      const categories: CategoriesResponse =
        await categoryService.getAllCategories()
      res.json(categories)
    } catch (err) {
      if (
        err instanceof InvalidCategoryError ||
        err instanceof EmptyCategoryError
      ) {
        res.status(400).json({ message: "Invalid category" })
        return
      }
      logger.error({ err }, "Failed to fetch categories")
      res.status(500).json({ message: "Failed to fetch categories" })
    }
  })
}
