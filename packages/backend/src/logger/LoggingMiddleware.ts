import { Request, Response, NextFunction } from "express"
import { Socket } from "socket.io"
import { Logger } from "./Logger"

export function LoggingMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    logger.info({
      type: "request",
      method: req.method,
      url: req.url,
      path: req.path,
    })

    const logResponse = () => {
      const duration = Date.now() - startTime
      logger.info({
        type: "response",
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      })
    }

    const originalSend = res.send
    res.send = function (data) {
      logResponse()
      return originalSend.call(this, data)
    }

    next()
  }
}

export function WebSocketLoggingMiddleware(logger: Logger) {
  return (socket: Socket, next: (err?: Error) => void) => {
    const socketId = socket.id
    const address = socket.handshake.address
    const userAgent = socket.handshake.headers["user-agent"]

    logger.info({
      type: "ws:connection",
      socketId,
      address,
      userAgent,
    })

    socket.onAny((eventName: string, ...args: unknown[]) => {
      logger.info({
        type: "ws:event:incoming",
        socketId,
        event: eventName,
        argsCount: args.length,
      })
    })

    const originalEmit = socket.emit.bind(socket)
    socket.emit = function (eventName: string, ...args: unknown[]) {
      logger.info({
        type: "ws:event:outgoing",
        socketId,
        event: eventName,
        argsCount: args.length,
      })
      return originalEmit(eventName, ...args)
    } as typeof socket.emit

    socket.on("disconnect", (reason: string) => {
      logger.info({
        type: "ws:disconnect",
        socketId,
        reason,
      })
    })

    socket.on("error", (error: Error) => {
      logger.error({
        type: "ws:error",
        socketId,
        error: error.message,
        stack: error.stack,
      })
    })

    next()
  }
}
