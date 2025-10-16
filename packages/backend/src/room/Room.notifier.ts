import { Room } from "./Room"
import { Role } from "../player/Role"
import {
  Notification,
  PlayerNotificationService,
} from "../player/Player.notifier"
import { PlayersNotification } from "@impostor/schemas"
import { Player } from "../player/Player"

export enum NotificationType {
  ROOM_START = "room-start",
  PLAYER_CHANGE = "player-change",
}

export interface RoomNotifier {
  notifyRoomStart(room: Room): Promise<void>
  notifyPlayerChange(room: Room): Promise<void>
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
              word: isImpostor ? undefined : room.word?.word,
            },
          })
        }),
      )
    },
    async notifyPlayerChange(room) {
      const payload = buildPlayerNotification(room)

      await this.notifyRoom(room, {
        event: NotificationType.PLAYER_CHANGE,
        payload,
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

function currentPlayersDTOs(players: Player[]) {
  return players.map((p) => ({
    name: p.name,
    id: p.id,
    ready: p.ready,
  }))
}

function buildPlayerNotification(room: Room): PlayersNotification {
  return { currentPlayers: currentPlayersDTOs(room.players) }
}
