import { Card, List } from "antd"

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
            <h1>Room: {roomId} </h1>
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
