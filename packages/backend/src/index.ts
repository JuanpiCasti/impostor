import "dotenv/config"
import { Server } from "socket.io"
import express from "express"
import { createServer } from "node:http"

const port = +(process.env.PORT ?? 3000)
const allowedOrigins = process.env.ALLOWED_ORIGINS
if (!allowedOrigins) {
  throw new Error("Allowed origins not specified")
}

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
})

io.on("connection", (socket) => {
  console.log("id de cliente:", socket.id)

  socket.on("health", (_data) => {
    socket.emit("health", { status: "ok" })
  })
})

httpServer.listen(port)
