import axios from "axios"
import type { CategoriesResponse } from "@impostor/schemas"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await axios.get(`${API_BASE_URL}/categories`)
  return response.data
}
