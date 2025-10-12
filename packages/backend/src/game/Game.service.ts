
import { Player, PlayerIdentifier } from "../player/Player"
import { WordProvider } from "../category/Word.provider"

import { GameRepository } from "./Game.repository"
import { CreateGameRequest } from "@impostor/schemas"
import {
  ImpostorStrategyFactory,
  ImpostorStrategyType,
} from "../player/impostor/ImpostorStrategyFactory"
import { Game, GameIdentifier, GameStatus } from "./Game"
import { GameAlreadyStartedError, RoomFullError } from "./Game.error"
import { Logger } from "pino"
import { GameNotifier } from "./Game.notifier"

export interface JoinGameResult {
  player: Player
  game: Game
  gameStarted: boolean
}

export interface GameService {
  joinGame: (gameId: GameIdentifier, playerName: string, playerId: PlayerIdentifier) => Promise<void>
  shouldStartGame: (gameId: GameIdentifier) => Promise<boolean>
  startGame: (gameId: GameIdentifier) => Promise<Game>
  getGame: (gameId: GameIdentifier) => Promise<Game>
  createGame: (createGameRequest: CreateGameRequest) => Promise<string>
  leaveGame: (
    playerId: PlayerIdentifier,
    gameId: GameIdentifier,
  ) => Promise<void>
  leaveGames: (
    playerId: PlayerIdentifier,
    gameIds: GameIdentifier[],
  ) => Promise<void>
  deleteGame(gameId: GameIdentifier): Promise<Game>
}

export function createGameService(
  gameRepository: GameRepository,
  impostorStrategyFactory: ImpostorStrategyFactory,
  wordProvider: WordProvider,
  logger: Logger,
  gameNotifier: GameNotifier
): GameService {
  return {
    async joinGame(gameId: GameIdentifier, playerName: string, playerId ) {
      const game = await gameRepository.getGame(gameId)

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
        id: playerId
      }

      game.players.push(player)

      await gameNotifier.notifyPlayerJoined(game, playerName)

      if (game.players.length === game.maxPlayers) {
        const strategy = impostorStrategyFactory.create(
          ImpostorStrategyType.RANDOM,
        )
        strategy.assignRoles(game.players)
        game.status = GameStatus.STARTED

        await gameNotifier.notifyGameStart(game)
      }
    },

    async shouldStartGame(gameId: GameIdentifier) {
      const game = await gameRepository.getGame(gameId)
      return game.players.length === game.maxPlayers
    },

    async startGame(gameId: GameIdentifier) {
      const game = await gameRepository.getGame(gameId)

      if (game.status === GameStatus.STARTED) {
        throw new GameAlreadyStartedError("Game already started")
      }

      const strategy = impostorStrategyFactory.create(
        ImpostorStrategyType.RANDOM,
      )
      strategy.assignRoles(game.players)
      game.status = GameStatus.STARTED

      return game
    },

    async getGame(gameId: GameIdentifier) {
      return await gameRepository.getGame(gameId)
    },

    async createGame(createGameRequest: CreateGameRequest) {
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

    async leaveGame(playerId: PlayerIdentifier, gameId: GameIdentifier) {
      let game
      try {
        game = await gameRepository.getGame(gameId)
      } catch (err) {
        if (err instanceof Error) {
          logger.error({ err }, "Could not find game to leave")
        }
        return
      }
      const players = game.players
      const index = players.findIndex((p) => p.id == playerId)
      if (index !== -1) {
        players.splice(index, 1)
      }
      gameNotifier.notifyLeftGame(game, playerId)
      if (players.length <= 0) {
        this.deleteGame(gameId)
        return
      }
    },

    async leaveGames(playerId: PlayerIdentifier, gameIds: GameIdentifier[]) {
      await Promise.all(gameIds.map((g) => this.leaveGame(playerId, g)))
    },

    async deleteGame(gameId: GameIdentifier) {
      return await gameRepository.deleteGame(gameId)
    },
  }
}
