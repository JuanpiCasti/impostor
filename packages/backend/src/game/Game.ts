import { Player, PlayerIdentifier } from "../player/Player"
import { Word } from "../category/Word"

export type GameIdentifier = string

export enum GameStatus {
  CREATING = "CREATING",
  STARTED = "STARTED",
}

export interface Game {
  gameId: string
  maxPlayers: number
  word: Word
  players: Player[]
  impostor?: PlayerIdentifier
  status: GameStatus
}
