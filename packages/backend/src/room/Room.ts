import { Player, PlayerIdentifier } from "../player/Player"
import { Word } from "../category/Word"

export type RoomIdentifier = string

export enum RoomStatus {
  CREATING = "CREATING",
  STARTED = "STARTED",
}

export interface Room {
  roomId: string
  maxPlayers: number
  word: Word
  players: Player[]
  impostor?: PlayerIdentifier
  status: RoomStatus
}
