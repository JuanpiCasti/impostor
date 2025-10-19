import * as z from "zod"

export const CreateRoomRequestSchema = z.object({
  category: z.string().min(3).max(30),
})
export type CreateRoomRequest = z.infer<typeof CreateRoomRequestSchema>

export const JoinRequestSchema = z.object({
  playerName: z.string().min(3).max(30),
  roomId: z.string().length(6),
})
export type JoinRequest = z.infer<typeof JoinRequestSchema>

export type WordNotificationPayload =
  | { role: "IMPOSTOR"; word: undefined }
  | { role: "PLAYER"; word: string }

export type Category = string

export interface CategoriesResponse {
  categories: Category[]
}

export interface CreateRoomResponse {
  roomId: string
}

export enum RoomStatus {
  CREATING = "CREATING",
  STARTED = "STARTED",
}

export interface PlayerOut {
  name: string
  id: string
  ready?: boolean
}

export interface PlayersNotification {
  currentPlayers: Array<PlayerOut>
}

export interface RoomStartNotification {
  role: string
  word: string
}
