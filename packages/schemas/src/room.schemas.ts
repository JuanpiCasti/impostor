import * as z from "zod"

export const CreateRoomRequestSchema = z.object({
  maxPlayers: z.int(),
  category: z.string().min(3).max(10),
})
export type CreateRoomRequest = z.infer<typeof CreateRoomRequestSchema>

export const JoinRequestSchema = z.object({
  playerName: z.string().min(3).max(10),
  roomId: z.string().length(6),
})
export type JoinRequest = z.infer<typeof JoinRequestSchema>

export type WordNotificationPayload =
  | { role: "IMPOSTOR"; word: undefined }
  | { role: "PLAYER"; word: string }
