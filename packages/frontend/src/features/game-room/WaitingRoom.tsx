import { CopyOutlined } from "@ant-design/icons"
import { Button, Card, List } from "antd"
import "./WaitingRoom.css"

export default function WaitingRoom({
  players,
  maxPlayers,
  roomId,
}: {
  players: string[]
  maxPlayers: number
  roomId: string
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
              <h1>Room: {roomId} 

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(roomId)
                }}
              >
                <CopyOutlined className="copy-icon" />
              </Button>
              </h1>

            </div>
            <p>
              {players.length} of {maxPlayers}
            </p>
          </div>
        }
        bordered
        dataSource={players}
        renderItem={(player) => <List.Item>{player}</List.Item>}
      />
    </Card>
  )
}
