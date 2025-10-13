import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import WaitingRoom from "./WaitingRoom"
import { io } from "socket.io-client"
import type { PlayerJoinedNotification } from "@impostor/schemas"

const BASE_URL = import.meta.env.VITE_WS_BASE_URL
const socket = io(`${BASE_URL}`, { reconnectionDelayMax: 10000 })

export default function GameRoom() {
  const [players, setPlayers] = useState<string[]>([])
  const [maxPlayers, setMaxPlayers] = useState(0)
  const [gameState, setGameState] = useState("CREATING")
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get("roomId")

  useEffect(() => {
    console.log(roomId)
    socket.emit("join-room", { roomId: roomId, playerName: "juampi" })

    socket.on("player-joined", (notif: PlayerJoinedNotification) => {
      console.log("player joined")
      setPlayers(notif.currentPlayers.map((p) => p.name))
      setMaxPlayers(notif.maxPlayers)
    })
  }, [roomId])

  return gameState === "CREATING" ? (
    <WaitingRoom players={players} maxPlayers={maxPlayers} />
  ) : (
    <div />
  )
}
