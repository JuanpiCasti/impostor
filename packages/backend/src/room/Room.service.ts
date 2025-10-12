import { Player, PlayerIdentifier } from "../player/Player"
import { WordProvider } from "../category/Word.provider"

import { RoomRepository } from "./Room.repository"
import { CreateRoomRequest } from "@impostor/schemas"
import {
  ImpostorStrategyFactory,
  ImpostorStrategyType,
} from "../player/impostor/ImpostorStrategyFactory"
import { Room, RoomIdentifier, RoomStatus } from "./Room"
import { RoomAlreadyStartedError, RoomFullError } from "./Room.error"
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
  shouldStartRoom: (roomId: RoomIdentifier) => Promise<boolean>
  startRoom: (roomId: RoomIdentifier) => Promise<Room>
  getRoom: (roomId: RoomIdentifier) => Promise<Room>
  createRoom: (createRoomRequest: CreateRoomRequest) => Promise<string>
  leaveRoom: (
    playerId: PlayerIdentifier,
    roomId: RoomIdentifier,
  ) => Promise<void>
  leaveRooms: (
    playerId: PlayerIdentifier,
    roomIds: RoomIdentifier[],
  ) => Promise<void>
  deleteRoom(roomId: RoomIdentifier): Promise<Room>
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

      if (room.status === RoomStatus.STARTED) {
        throw new RoomAlreadyStartedError(
          "Cannot join a room that has already started",
        )
      }

      if (room.players.length >= room.maxPlayers) {
        throw new RoomFullError("Room is full")
      }

      const player: Player = {
        name: playerName,
        id: playerId,
      }

      room.players.push(player)

      await roomNotifier.notifyPlayerJoined(room, playerName)

      if (room.players.length === room.maxPlayers) {
        const strategy = impostorStrategyFactory.create(
          ImpostorStrategyType.RANDOM,
        )
        strategy.assignRoles(room.players)
        room.status = RoomStatus.STARTED

        await roomNotifier.notifyRoomStart(room)
      }
    },

    async shouldStartRoom(roomId: RoomIdentifier) {
      const room = await roomRepository.getRoom(roomId)
      return room.players.length === room.maxPlayers
    },

    async startRoom(roomId: RoomIdentifier) {
      const room = await roomRepository.getRoom(roomId)

      if (room.status === RoomStatus.STARTED) {
        throw new RoomAlreadyStartedError("Room already started")
      }

      const strategy = impostorStrategyFactory.create(
        ImpostorStrategyType.RANDOM,
      )
      strategy.assignRoles(room.players)
      room.status = RoomStatus.STARTED

      return room
    },

    async getRoom(roomId: RoomIdentifier) {
      return await roomRepository.getRoom(roomId)
    },

    async createRoom(createRoomRequest: CreateRoomRequest) {
      if (
        createRoomRequest.maxPlayers < 3 ||
        createRoomRequest.maxPlayers > 10
      ) {
        throw new Error("Invalid player count")
      }

      const word = await wordProvider.getRandomWord(createRoomRequest.category)
      const roomId = await roomRepository.createRoom(
        word,
        createRoomRequest.maxPlayers,
      )

      return roomId
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
      roomNotifier.notifyLeftRoom(room, playerId)
      if (players.length <= 0) {
        this.deleteRoom(roomId)
        return
      }
    },

    async leaveRooms(playerId: PlayerIdentifier, roomIds: RoomIdentifier[]) {
      await Promise.all(roomIds.map((r) => this.leaveRoom(playerId, r)))
    },

    async deleteRoom(roomId: RoomIdentifier) {
      return await roomRepository.deleteRoom(roomId)
    },
  }
}
