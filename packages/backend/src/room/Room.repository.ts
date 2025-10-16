import { Room, RoomIdentifier } from "./Room"
import { RoomStatus } from "@impostor/schemas"
import { RoomNotFoundError } from "./Room.error"

export interface RoomRepository {
  deleteRoom(roomId: string): Promise<Room>
  createRoom: (category: string) => Promise<string>
  getRoom: (id: RoomIdentifier) => Promise<Room>
  updateRoom: (room: Room) => Promise<void>
}

export function MemoryRoomRepository() {
  const rooms = new Map<RoomIdentifier, Room>()

  return {
    async getRoom(id: RoomIdentifier) {
      const room = rooms.get(id)
      if (!room) {
        throw new RoomNotFoundError("Room not found")
      }
      return room
    },

    async createRoom(category: string) {
      const roomId = generateRandomString(6)
      const room: Room = {
        roomId: roomId,
        category: category,
        players: [],
        status: RoomStatus.CREATING,
      }

      rooms.set(roomId, room)

      return roomId
    },

    async updateRoom(room: Room) {
      rooms.set(room.roomId, room)
    },

    async deleteRoom(roomId: RoomIdentifier) {
      const room = this.getRoom(roomId)
      rooms.delete(roomId)
      return room
    },
  }
}

export function generateRandomString(length: number = 6) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
