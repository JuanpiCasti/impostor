import { Role } from "./Role"

export type PlayerIdentifier = string

export interface Player {
  name: string
  id: PlayerIdentifier
  role?: Role
  ready?: boolean
}
