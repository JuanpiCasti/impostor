import { Player, PlayerIdentifier } from "../player/Player"

export type GameIdentifier = string

export enum GameStatus {
  CREATING = "CREATING",
  STARTED = "STARTED",
}

export interface Game {
  gameId: string
  maxPlayers: number
  word: string
  players: Player[]
  impostor?: PlayerIdentifier
  status: GameStatus
}
