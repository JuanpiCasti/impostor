import { Player, PlayerIdentifier } from "../domain/Player"

export type GameIdentifier = string

export interface Game {
  maxPlayers: number
  word: string
  players: Player[]
  impostor?: PlayerIdentifier
}
