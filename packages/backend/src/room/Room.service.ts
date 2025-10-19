import { Player, PlayerIdentifier } from "../player/Player"
import { WordProvider } from "../category/Word.provider"

import { RoomRepository } from "./Room.repository"
import {
  CreateRoomRequest,
  CreateRoomResponse,
  RoomStatus,
} from "@impostor/schemas"
import {
  ImpostorStrategyFactory,
  ImpostorStrategyType,
} from "../player/impostor/ImpostorStrategyFactory"
import { Room, RoomIdentifier } from "./Room"
import {
  PlayerNotInRoomError,
  RoomFullError,
} from "./Room.error"
import { Logger } from "pino"
import { RoomNotifier } from "./Room.notifier"

export interface JoinRoomResult {
  player: Player
  room: Room
  roomStarted: boolean
}

export interface RoomService {
  joinRoom: (
    roomId: RoomIdentifier,
    playerName: string,
    playerId: PlayerIdentifier,
  ) => Promise<void>
  startRoom: (roomId: RoomIdentifier) => Promise<Room>
  getRoom: (roomId: RoomIdentifier) => Promise<Room>
  createRoom: (
    createRoomRequest: CreateRoomRequest,
  ) => Promise<CreateRoomResponse>
  leaveRoom: (
    playerId: PlayerIdentifier,
    roomId: RoomIdentifier,
  ) => Promise<void>
  leaveRooms: (
    playerId: PlayerIdentifier,
    roomIds: RoomIdentifier[],
  ) => Promise<void>
  deleteRoom(roomId: RoomIdentifier): Promise<Room>
  setPlayerReady(
    roomId: RoomIdentifier,
    playerId: PlayerIdentifier,
    ready: boolean,
  ): Promise<void>
}

export function createRoomService(
  roomRepository: RoomRepository,
  impostorStrategyFactory: ImpostorStrategyFactory,
  wordProvider: WordProvider,
  logger: Logger,
  roomNotifier: RoomNotifier,
): RoomService {
  return {
    async joinRoom(roomId: RoomIdentifier, playerName: string, playerId) {
      const room = await roomRepository.getRoom(roomId)

      if (room.players.length >= 20) {
        throw new RoomFullError("Room is full")
      }

      const player: Player = {
        name: playerName,
        id: playerId,
      }

      room.players.push(player)

      await roomNotifier.notifyPlayerChange(room)
    },

    async startRoom(roomId: RoomIdentifier) {
      const room = await roomRepository.getRoom(roomId)

      const strategy = impostorStrategyFactory.create(
        ImpostorStrategyType.RANDOM, // May implement other strategies in the future (like "all impostors")
      )

      room.word = await wordProvider.getRandomWord(room.category)
      strategy.assignRoles(room.players)
      room.status = RoomStatus.STARTED

      await roomRepository.updateRoom(room)

      await roomNotifier.notifyRoomStart(room)

      room.players.forEach((p) => {
        p.ready = false
      })

      return room
    },

    async getRoom(roomId: RoomIdentifier) {
      return await roomRepository.getRoom(roomId)
    },

    async createRoom(createRoomRequest: CreateRoomRequest) {
      const roomId = await roomRepository.createRoom(createRoomRequest.category)

      return { roomId }
    },

    async leaveRoom(playerId: PlayerIdentifier, roomId: RoomIdentifier) {
      let room
      try {
        room = await roomRepository.getRoom(roomId)
      } catch (err) {
        if (err instanceof Error) {
          logger.error({ err }, "Could not find room to leave")
        }
        return
      }
      const players = room.players
      const index = players.findIndex((p) => p.id == playerId)
      if (index !== -1) {
        players.splice(index, 1)
      }
      roomNotifier.notifyPlayerChange(room)
      if (players.length <= 0) {
        this.deleteRoom(roomId)
        return
      }

      const hasReadyPlayers = room.players.some((p) => p.ready === true)
      if (hasReadyPlayers) {
        const allReady = room.players.every((p) => p.ready === true)
        if (allReady && players.length >= 3) {
          await this.startRoom(roomId)
        }
      }
    },

    async leaveRooms(playerId: PlayerIdentifier, roomIds: RoomIdentifier[]) {
      await Promise.all(roomIds.map((r) => this.leaveRoom(playerId, r)))
    },

    async deleteRoom(roomId: RoomIdentifier) {
      // Notify players room ended
      return await roomRepository.deleteRoom(roomId)
    },

    async setPlayerReady(
      roomId: RoomIdentifier,
      playerId: PlayerIdentifier,
      ready: boolean,
    ) {
      const room = await roomRepository.getRoom(roomId)
      const player = room.players.find((p) => p.id === playerId)

      if (!player) {
        throw new PlayerNotInRoomError(playerId, roomId)
      }

      player.ready = ready

      await roomRepository.updateRoom(room)
      await roomNotifier.notifyPlayerChange(room)

      const allReady = room.players.every((p) => p.ready === true)
      if (room.players.length >= 3 && allReady) {
        await this.startRoom(roomId)
      }
    },
  }
}
