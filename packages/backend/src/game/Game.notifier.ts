import { Server } from "socket.io"
import { Game, GameIdentifier } from "./Game"
import { PlayerProvider } from "../player/Player.provider"

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
      roomId: GameIdentifier,
      type: NotificationType,
      game: Game,
    ) => {
      if (type === NotificationType.GAME_START) {
        io.to(roomId).emit("game-start", { yourWord: "gameStarting" })
        game.players.forEach(async (p) => {
          const conn = await playerProvider.getPlayerConnection(p.id)
          const number = Math.floor(Math.random() * game.players.length)
          io.to(conn).emit("HERE IS YOUR WORD", number)
        })
      }
    },
  }
}
