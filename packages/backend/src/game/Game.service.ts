import { randomUUID } from "node:crypto"

import { Player } from "../player/Player"

import { GameRepository } from "./Game.repository"
import { CreateGameRequest, JoinRequest } from "./Game.schemas"
import { GameNotifier, NotificationType } from "./Game.notifier"

export interface GameService {
  joinGame: (joinRequest: JoinRequest) => Promise<Player>
  createGame: (createGameRequest: CreateGameRequest) => Promise<string>
}

export function createGameService(
  gameRepository: GameRepository,
  gameNotifier: GameNotifier,
) {
  return {
    joinGame: async (joinRequest: JoinRequest) => {
      const { roomId, playerName } = joinRequest
      const player: Player = {
        name: playerName,
        id: randomUUID(),
      }
      const game = await gameRepository.getGame(roomId)
      // TODO: validate max players and used name
      game.players.push(player)
      if (game.players.length == game.maxPlayers) {
        gameNotifier.notify(roomId, NotificationType.GAME_START, game)
      }
      return player
    },
    createGame: async (createGameRequest: CreateGameRequest) => {
      if (
        createGameRequest.maxPlayers < 3 ||
        createGameRequest.maxPlayers > 10
      ) {
        throw new Error("Invalid player count")
      }

      const gameId = await gameRepository.createGame(
        createGameRequest.category,
        createGameRequest.maxPlayers,
      )

      return gameId
    },
  }
}
