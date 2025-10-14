import { useEffect, useState } from "react"
import { useLocation, useSearchParams } from "react-router"
import WaitingRoom from "./WaitingRoom"
import { io } from "socket.io-client"
import type {
  PlayerJoinedNotification,
  RoomStartNotification,
} from "@impostor/schemas"
import DisplayWord from "./DisplayWord"
import Countdown from "./Countdown"

const BASE_URL = import.meta.env.VITE_WS_BASE_URL

export default function GameRoom() {
  const [players, setPlayers] = useState<string[]>([])
  const [maxPlayers, setMaxPlayers] = useState(0)
  const [gameState, setGameState] = useState("CREATING")
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get("roomId")
  const [role, setRole] = useState("")
  const [word, setWord] = useState("")
  const [countdown, setCountdown] = useState(5)
  const [countdownFinished, setCountdownFinished] = useState(false)

  const location = useLocation()
  const playerName = location.state?.playerName

  useEffect(() => {
    if (!roomId) return

    const socket = io(`${BASE_URL}`, { reconnectionDelayMax: 10000 })

    socket.on("connect", () => {
      socket.emit("join-room", { roomId: roomId, playerName: playerName })
    })

    const onPlayerJoined = (notif: PlayerJoinedNotification) => {
      console.log("player joined")
      setPlayers(notif.currentPlayers.map((p) => p.name))
      setMaxPlayers(notif.maxPlayers)
    }

    const onRoomStarted = (notif: RoomStartNotification) => {
      setGameState("STARTED")
      setRole(notif.role)
      setWord(notif.word)
      socket.disconnect()
    }

    socket.on("player-joined", onPlayerJoined)

    socket.on("room-start", onRoomStarted)

    return () => {
      socket.off("player-joined", onPlayerJoined)
      socket.disconnect()
    }
  }, [roomId, playerName])

  useEffect(() => {
    if (gameState !== "STARTED") return
    if (countdown <= 0) {
      setCountdownFinished(true)
      return
    }
    const timerId = setInterval(() => {
      setCountdown((countdown) => countdown - 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [countdown, gameState])

  return gameState === "CREATING" ? (
    <WaitingRoom
      roomId={roomId || "..."}
      players={players}
      maxPlayers={maxPlayers}
    />
  ) : countdownFinished ? (
    <DisplayWord word={word} role={role} />
  ) : (
    <Countdown countdown={countdown} />
  )
}
