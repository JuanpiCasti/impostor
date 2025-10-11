import { Server } from "socket.io"
import { Game, GameIdentifier } from "./Game"
import { PlayerProvider } from "../player/Player.provider"
import { Role } from "../player/Role"

export enum NotificationType {
  GAME_START,
}

export interface GameNotifier {
  notify: (
    roomId: GameIdentifier,
    type: NotificationType,
    game: Game,
  ) => Promise<void>
}

export function createGameNotifier(io: Server, playerProvider: PlayerProvider) {
  return {
    notify: async (
      _roomId: GameIdentifier,
      type: NotificationType,
      game: Game,
    ) => {
      switch (type) {
        case NotificationType.GAME_START:
          game.players.forEach(async (p) => {
            const conn = await playerProvider.getPlayerConnection(p.id)

            io.to(conn).emit("game-start", {
              role: p.role,
              word: p.role === Role.PLAYER ? game.word.word : Role.IMPOSTOR,
            })
          })
          break
      }
    },
  }
}
