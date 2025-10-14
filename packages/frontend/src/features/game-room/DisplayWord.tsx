import { Card } from "antd"
import "./DisplayWord.css"

export default function DisplayWord({
  word,
  role,
}: {
  word: string
  role: string
}) {
  const message =
    role === "IMPOSTOR" ? "You are the impostor!" : `Your word is: ${word}`
  return (
    <Card title="Game start!" variant="borderless" style={{ width: 300 }}>
      <div className="message-container">
        <p className="message-text">{message}</p>
      </div>
    </Card>
  )
}
