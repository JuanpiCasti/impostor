import { Button, Card } from "antd"
import "./DisplayWord.css"

export default function DisplayWord({
  word,
  role,
  onPlayAgain,
  disabled,
}: {
  word: string
  role: string
  onPlayAgain: () => void
  disabled: boolean
}) {
  const message =
    role === "IMPOSTOR" ? "You are the impostor!" : `Your word is: ${word}`
  return (
    <Card title="Game start!" variant="borderless" style={{ width: 300 }}>
      <div className="message-container">
        <p className="message-text">{message}</p>
      </div>
      <div>
        <Button type="primary" onClick={onPlayAgain} disabled={disabled}>
          Play Again
        </Button>
      </div>
    </Card>
  )
}
