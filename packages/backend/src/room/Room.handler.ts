import { Application, Request, Response } from "express"
import { Socket } from "socket.io"

import { CreateRoomRequestSchema, JoinRequest } from "@impostor/schemas"
import { RoomService } from "./Room.service"
import {
  RoomAlreadyStartedError,
  RoomNotFoundError,
  InvalidJoinRequestException,
  RoomFullError,
} from "./Room.error"
import { Logger } from "../logger/Logger"
import { RoomController } from "./Room.controller"

export function registerRoomSocketHandlers(
  socket: Socket,
  roomController: RoomController,
  logger: Logger,
) {
  socket.on("join-room", async (joinRequest: JoinRequest) => {
    try {
      await roomController.joinRoom(socket, joinRequest)
    } catch (err) {
      if (
        err instanceof RoomFullError ||
        err instanceof RoomAlreadyStartedError ||
        err instanceof RoomNotFoundError ||
        err instanceof RoomAlreadyStartedError ||
        err instanceof RoomFullError ||
        err instanceof InvalidJoinRequestException
      ) {
        socket.emit("room-error", { message: err.message })
        return
      }
      socket.emit("room-error", { message: "Could not join room." })
    }
  })

  socket.on("disconnect", async () => {
    try {
      await roomController.leaveRoom(socket)
    } catch (err) {
      logger.error({ err }, "Error on disconnection routine")
    }
  })
}

export function registerCreateRoomHandler(
  app: Application,
  roomService: RoomService,
  logger: Logger,
) {
  app.post("/room", async (req: Request, res: Response) => {
    const data = req.body
    const parsedData = CreateRoomRequestSchema.safeParse(data)
    if (!parsedData.success) {
      res.status(400).json(parsedData.error.issues)
      return
    }

    let response
    try {
      response = await roomService.createRoom(parsedData.data)
    } catch (err) {
      logger.error({ err }, "Failed to create room")
      res.status(500).json({ message: "error" })
      return
    }
    res.json(response)
  })
}
