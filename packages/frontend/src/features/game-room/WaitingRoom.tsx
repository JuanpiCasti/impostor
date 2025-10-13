import { Card, List } from "antd"

export default function WaitingRoom({
  players,
  maxPlayers,
}: {
  players: string[]
  maxPlayers: number
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
            {players.length} of {maxPlayers}
          </div>
        }
        bordered
        dataSource={players}
        renderItem={(player) => <List.Item>{player}</List.Item>}
      />
    </Card>
  )
}
