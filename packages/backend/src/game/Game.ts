import { Player, PlayerIdentifier } from "../player/Player"

export type GameIdentifier = string

export interface Game {
  maxPlayers: number
  word: string
  players: Player[]
  impostor?: PlayerIdentifier
}
