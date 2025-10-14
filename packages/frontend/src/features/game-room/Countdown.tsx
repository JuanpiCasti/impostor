import { Card } from "antd"
import "./Countdown.css"

interface CountdownProps {
  countdown: number
}

export default function Countdown({ countdown }: CountdownProps) {
  return (
    <Card title="Game starting..." variant="borderless" style={{ width: 300 }}>
      <div className="countdown-container">
        <p className="countdown-seconds">{countdown}</p>
      </div>
    </Card>
  )
}
