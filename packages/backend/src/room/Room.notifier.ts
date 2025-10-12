import { Room } from "./Room"
import { Role } from "../player/Role"
import {
  Notification,
  PlayerNotificationService,
} from "../player/Player.notifier"

export enum NotificationType {
  ROOM_START = "room-start",
  PLAYER_LEFT = "player-left",
  PLAYER_JOINED = "player-joined",
}

export interface RoomNotifier {
  notifyLeftRoom(room: Room, playerId: string): unknown
  notifyRoomStart(room: Room): Promise<void>
  notifyPlayerJoined(room: Room, playerName: string): Promise<void>
  notifyRoom<T>(room: Room, notification: Notification<T>): Promise<void>
}

export function createRoomNotifier(
  notificationService: PlayerNotificationService,
): RoomNotifier {
  return {
    async notifyRoomStart(room) {
      await Promise.all(
        room.players.map(async (player) => {
          const isImpostor = player.role === Role.IMPOSTOR

          await notificationService.notifyPlayer(player.id, {
            event: NotificationType.ROOM_START,
            payload: {
              role: player.role,
              word: isImpostor ? undefined : room.word.word,
            },
          })
        }),
      )
    },
    async notifyPlayerJoined(room, playerName) {
      this.notifyRoom(room, {
        event: NotificationType.PLAYER_JOINED,
        payload: {
          name: playerName,
        },
      })
    },
    async notifyLeftRoom(room, playerId) {
      this.notifyRoom(room, {
        event: NotificationType.PLAYER_LEFT,
        payload: {
          playerId,
        },
      })
    },
    async notifyRoom(room, payload) {
      await Promise.all(
        room.players.map(async (player) => {
          await notificationService.notifyPlayer(player.id, payload)
        }),
      )
    },
  }
}
