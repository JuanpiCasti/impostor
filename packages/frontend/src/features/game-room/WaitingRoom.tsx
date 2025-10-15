import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons"
import { Button, Card, List } from "antd"
import "./WaitingRoom.css"
import type { PlayerOut } from "@impostor/schemas"

export default function WaitingRoom({
  players,
  onPlayerReady,
  roomId,
  disabled,
}: {
  players: PlayerOut[]
  onPlayerReady: () => void
  roomId: string
  disabled: boolean
}) {
  return (
    <Card
      title="Waiting for players..."
      variant="borderless"
      style={{ width: 300 }}
    >
      <List
        header={
          <div>
            <div className="waiting-header">
              <h1>
                Room: {roomId}
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId)
                  }}
                >
                  <CopyOutlined className="copy-icon" />
                </Button>
              </h1>
            </div>
          </div>
        }
        bordered
        dataSource={players}
        renderItem={(player) => (
          <List.Item>
            <span className="player-name">{player.name}</span>
            {player.ready ? (
              <CheckCircleOutlined className="ready-icon" />
            ) : (
              <ClockCircleOutlined className="waiting-icon" />
            )}
          </List.Item>
        )}
      />
      <div style={{ marginTop: "1rem" }}>
        <Button type="primary" onClick={onPlayerReady} disabled={disabled}>
          Ready
        </Button>
      </div>
    </Card>
  )
}
