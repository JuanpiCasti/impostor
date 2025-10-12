import { Game } from "./Game"
import { Role } from "../player/Role"
import { PlayerNotificationService } from "../notification/PlayerNotificationService"

export enum NotificationType {
  GAME_START = "game-start",
}

export interface GameNotifier {
  notifyGameStart(game: Game): Promise<void>
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
            type: NotificationType.GAME_START,
            data: {
              role: player.role,
              word: isImpostor ? undefined : game.word.word,
            },
          })
        }),
      )
    },
  }
}
