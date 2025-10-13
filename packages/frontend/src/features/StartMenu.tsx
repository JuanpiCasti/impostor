import { Button, Card, Space } from "antd"
import "./StartMenu.css"
import { Link } from "react-router"

export default function StartMenu() {
  return (
    <Card className="start-menu">
      <Space direction="vertical" size="large" align="center">
        <Link to="create-room">
          <Button type="primary" size="large">
            Create Room
          </Button>
        </Link>
        <Link to="join-room">
          <Button size="large">Join Room</Button>
        </Link>
      </Space>
    </Card>
  )
}
