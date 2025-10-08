import * as z from "zod"

export const CreateGameRequestSchema = z.object({
  maxPlayers: z.int(),
  category: z.string().min(3).max(10),
})
export type CreateGameRequest = z.infer<typeof CreateGameRequestSchema>

export const JoinRequestSchema = z.object({
  playerName: z.string().min(3).max(10),
  roomId: z.string().length(6),
})
export type JoinRequest = z.infer<typeof JoinRequestSchema>
