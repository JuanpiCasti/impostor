import { Button, Card, Form, Input } from "antd"
import { createSearchParams, useNavigate } from "react-router"

export default function RoomJoinForm() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  return (
    <>
      <Card className="form-menu">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            maxPlayers: 3,
          }}
          onFinish={(formData) => {
            navigate(
              "/room?" + createSearchParams({ roomId: formData.roomId }),
              {
                state: {
                  playerName: formData.playerName,
                },
              },
            )
          }}
        >
          <Form.Item
            label="Room ID"
            name="roomId"
            rules={[{ required: true, message: "Must enter a room ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Your name"
            name="playerName"
            rules={[{ required: true, message: "Must enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null} style={{ marginTop: "40px" }}>
            <Button type="primary" htmlType="submit" size="large">
              Join
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}
