import { useEffect, useState } from "react"
import { useLocation, useSearchParams } from "react-router"
import WaitingRoom from "./WaitingRoom"
import { io } from "socket.io-client"
import type {
  RoomStartNotification,
  PlayerOut,
  PlayersNotification,
} from "@impostor/schemas"
import DisplayWord from "./DisplayWord"
import Countdown from "./Countdown"
import { Spin } from "antd"
import ErrorMessage from "./ErrorMessage"
import type { Socket } from "socket.io-client"

const BASE_URL = import.meta.env.VITE_WS_BASE_URL

export default function GameRoom() {
  const [players, setPlayers] = useState<PlayerOut[]>([])
  const [gameState, setGameState] = useState("CREATING")
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get("roomId")
  const [role, setRole] = useState("")
  const [word, setWord] = useState("")
  const [countdown, setCountdown] = useState(5)
  const [countdownFinished, setCountdownFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [hasClickedReady, setHasClickedReady] = useState(false)
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null)

  const location = useLocation()
  const playerName = location.state?.playerName

  useEffect(() => {
    if (!roomId) return

    const socket = io(`${BASE_URL}`, { reconnectionDelayMax: 10000 })
    setSocketInstance(socket)

    socket.on("connect", () => {
      socket.emit("join-room", { roomId: roomId, playerName: playerName })
    })

    const onPlayerJoined = (notif: PlayersNotification) => {
      console.log("player joined")
      setLoading(false)
      setPlayers(notif.currentPlayers)
    }

    const onRoomStarted = (notif: RoomStartNotification) => {
      setGameState("STARTED")
      setRole(notif.role)
      setWord(notif.word)

      setHasClickedReady(false)
      setCountdown(5)
      setCountdownFinished(false)
    }

    const onRoomError = (notif: { message: string }) => {
      setError(true)
      setErrorMessage(notif.message)
    }

    const onPlayerChange = (notif: PlayersNotification) => {
      setPlayers(notif.currentPlayers)
      setLoading(false)
    }

    socket.on("player-joined", onPlayerJoined)

    socket.on("room-start", onRoomStarted)

    socket.on("room-error", onRoomError)

    socket.on("player-change", onPlayerChange)

    return () => {
      socket.off("player-joined", onPlayerJoined)
      socket.off("room-start", onRoomStarted)
      socket.off("room-error", onRoomError)
      socket.off("player-change", onPlayerChange)
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

  const handlePlayerReady = () => {
    if (socketInstance) {
      socketInstance.emit("player-ready")
      setHasClickedReady(true)
    }
    setGameState("CREATING")
  }

  if (error) {
    return <ErrorMessage message={errorMessage} />
  }

  if (loading) {
    return <Spin size="large" />
  }

  if (gameState === "CREATING") {
    return (
      <WaitingRoom
        roomId={roomId || "..."}
        players={players}
        onPlayerReady={handlePlayerReady}
        disabled={hasClickedReady}
      />
    )
  }

  if (countdownFinished) {
    return (
      <DisplayWord
        word={word}
        role={role}
        onPlayAgain={handlePlayerReady}
        disabled={hasClickedReady}
      />
    )
  }

  return <Countdown countdown={countdown} />
}
