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
            navigate({
              pathname: "/room",
              search: `?${createSearchParams({ roomId: formData.roomId })}`,
            })
          }}
        >
          <Form.Item
            label="Room ID"
            name="roomId"
            rules={[{ required: true, message: "Must enter a room ID" }]}
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
