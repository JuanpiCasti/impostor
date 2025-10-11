import { Player } from "../Player"

export interface ImpostorStrategy {
  assignRoles: (players: Player[]) => void
}
