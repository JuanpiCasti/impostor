import { randomUUID } from "node:crypto"

import { Player } from "../player/Player"
import { WordProvider } from "../category/Word.provider"

import { GameRepository } from "./Game.repository"
import { CreateGameRequest, JoinRequest } from "@impostor/schemas"
import { GameNotifier, NotificationType } from "./Game.notifier"
import {
  ImpostorStrategyFactory,
  ImpostorStrategyType,
} from "../player/impostor/ImpostorStrategyFactory"
import { Game, GameStatus } from "./Game"
import { GameAlreadyStartedError, RoomFullError } from "./Game.error"

export interface JoinGameResult {
  player: Player
  shouldStart: boolean
}

export interface GameService {
  joinGame: (joinRequest: JoinRequest) => Promise<JoinGameResult>
  startGame: (roomId: string) => Promise<void>
  createGame: (createGameRequest: CreateGameRequest) => Promise<string>
}

function shouldGameStart(game: Game): boolean {
  return game.players.length === game.maxPlayers
}

export function createGameService(
  gameRepository: GameRepository,
  gameNotifier: GameNotifier,
  impostorStrategyFactory: ImpostorStrategyFactory,
  wordProvider: WordProvider,
): GameService {
  return {
    joinGame: async (joinRequest: JoinRequest) => {
      const { roomId, playerName } = joinRequest
      const game = await gameRepository.getGame(roomId)

      if (game.status === GameStatus.STARTED) {
        throw new GameAlreadyStartedError(
          "Cannot join a game that has already started",
        )
      }

      if (game.players.length >= game.maxPlayers) {
        throw new RoomFullError("Room is full")
      }

      const player: Player = {
        name: playerName,
        id: randomUUID(),
      }

      game.players.push(player)

      const shouldStart = shouldGameStart(game)

      return { player, shouldStart }
    },
    startGame: async (roomId: string) => {
      const game = await gameRepository.getGame(roomId)

      game.status = GameStatus.STARTED
      const strategy = impostorStrategyFactory.create(
        ImpostorStrategyType.RANDOM,
      )
      strategy.assignRoles(game.players)

      await gameNotifier.notify(roomId, NotificationType.GAME_START, game)
    },
    createGame: async (createGameRequest: CreateGameRequest) => {
      if (
        createGameRequest.maxPlayers < 3 ||
        createGameRequest.maxPlayers > 10
      ) {
        throw new Error("Invalid player count")
      }

      const word = await wordProvider.getRandomWord(createGameRequest.category)
      const gameId = await gameRepository.createGame(
        word,
        createGameRequest.maxPlayers,
      )

      return gameId
    },
  }
}
