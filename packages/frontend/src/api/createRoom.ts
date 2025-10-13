import type { CreateRoomRequest } from "@impostor/schemas"
import axios, { AxiosError } from "axios"
import {
  CouldNotCreateRoomClientError,
  CouldNotCreateRoomServerError,
} from "../features/create-room/Errors"
import type { CreateRoomResponse } from "@impostor/schemas"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export async function createRoomPost(
  values: CreateRoomRequest,
): Promise<CreateRoomResponse> {
  try {
    const response: CreateRoomResponse = await axios.post(
      `${API_BASE_URL}/room`,
      values,
    )
    return response
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response) {
        if (err.response.status === 500) {
          throw new CouldNotCreateRoomServerError()
        } else if (err.response.status === 400) {
          throw new CouldNotCreateRoomClientError(err.response.data)
        }
      }
    }
    throw err
  }
}
