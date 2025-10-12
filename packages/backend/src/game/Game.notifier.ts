import { Game } from "./Game"
import { Role } from "../player/Role"
import {
  Notification,
  PlayerNotificationService,
} from "../player/Player.notifier"

export enum NotificationType {
  GAME_START = "game-start",
  PLAYER_LEFT = "player-left",
  PLAYER_JOINED = "player-joined",
}

export interface GameNotifier {
  notifyLeftGame(game: Game, playerId: string): unknown
  notifyGameStart(game: Game): Promise<void>
  notifyPlayerJoined(game: Game, playerName: string): Promise<void>
  notifyRoom<T>(game: Game, notification: Notification<T>): Promise<void>
}

export function createGameNotifier(
  notificationService: PlayerNotificationService,
): GameNotifier {
  return {
    async notifyGameStart(game) {
      await Promise.all(
        game.players.map(async (player) => {
          const isImpostor = player.role === Role.IMPOSTOR

          await notificationService.notifyPlayer(player.id, {
            event: NotificationType.GAME_START,
            payload: {
              role: player.role,
              word: isImpostor ? undefined : game.word.word,
            },
          })
        }),
      )
    },
    async notifyPlayerJoined(game, playerName) {
      this.notifyRoom(game, {
            event: NotificationType.PLAYER_JOINED,
            payload: {
              name: playerName,
            },
          })
    },
    async notifyLeftGame(game, playerId) {
      this.notifyRoom(game, {
            event: NotificationType.PLAYER_LEFT,
            payload: {
              playerId,
            },
          })
    },
    async notifyRoom(game, payload) {
      await Promise.all(
        game.players.map(async (player) => {
          await notificationService.notifyPlayer(player.id, payload)
        }),
      )
    },
  }
}
