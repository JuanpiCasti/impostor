export class RoomFullError extends Error {}

export class RoomAlreadyStartedError extends Error {}

export class RoomNotFoundError extends Error {}

export class InvalidJoinRequestException extends Error {}

export class SessionNotFoundError extends Error {}

export class InvalidPlayerCountError extends Error {}

export class RoomNotFinishedError extends Error {
  constructor(roomId: string) {
    super(`Room ${roomId} is not in finished state`)
    this.name = "RoomNotFinishedError"
  }
}

export class PlayerNotInRoomError extends Error {
  constructor(playerId: string, roomId: string) {
    super(`Player ${playerId} is not in room ${roomId}`)
    this.name = "PlayerNotInRoomError"
  }
}
