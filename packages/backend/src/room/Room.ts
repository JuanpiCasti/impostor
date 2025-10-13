import { Player, PlayerIdentifier } from "../player/Player"
import { Word } from "../category/Word"
import { RoomStatus } from "@impostor/schemas"

export type RoomIdentifier = string

export interface Room {
  roomId: string
  maxPlayers: number
  word: Word
  players: Player[]
  impostor?: PlayerIdentifier
  status: RoomStatus
}
