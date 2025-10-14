import { Button, Card, Form, Input, Modal, Select } from "antd"
import "./RoomCreationForm.css"
import { useEffect, useState } from "react"
import { getCategories } from "../../api/fetchCategories"
import type { CategoryDropdownItem } from "./CategoryDropdownItem"
import { useNavigate, createSearchParams } from "react-router"
import { createRoomPost } from "../../api/createRoom"
import type { CreateRoomRequest } from "@impostor/schemas"
import { CouldNotCreateRoomClientError } from "./Errors"
import { ErrorMessage } from "./ModalErrorMessage"
import type { $ZodIssue } from "zod/v4/core"

export default function RoomCreationForm() {
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<CategoryDropdownItem[]>([])
  const [errorIssues, setErrorIssues] = useState<$ZodIssue[] | null>(null)
  const [isServerError, setIsServerError] = useState(false)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mapToSelectorItem = (c: string): { value: string; label: string } => {
    return { value: c, label: c }
  }

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories()
      if (data) {
        const items = data.categories.map(mapToSelectorItem)
        setCategories(items)
        if (data.categories.length > 0) {
          form.setFieldsValue({ category: data.categories[0] })
        }
      }
    }
    loadCategories()
  }, [form])

  const playerOptions = Array.from({ length: 8 }, (_, i) => ({
    value: i + 3,
    label: `${i + 3} Players`,
  }))

  const createRoom = async (
    roomCreationRequest: CreateRoomRequest & { playerName: string },
  ) => {
    try {
      const room = await createRoomPost(roomCreationRequest)
      navigate("/room?" + createSearchParams({ roomId: room.roomId }), {
        state: {
          playerName: roomCreationRequest.playerName,
        },
      })
    } catch (err) {
      if (err instanceof CouldNotCreateRoomClientError) {
        setErrorIssues(err.data)
        setIsServerError(false)
      } else {
        setErrorIssues(null)
        setIsServerError(true)
      }
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <Card className="form-menu">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            maxPlayers: 3,
          }}
          onFinish={createRoom}
        >
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Must select a category." }]}
          >
            <Select
              options={categories}
              style={{ width: 200, textAlign: "left" }}
            />
          </Form.Item>
          <Form.Item
            label="Players"
            name="maxPlayers"
            rules={[
              { required: true, message: "Must select number of players." },
            ]}
          >
            <Select
              options={playerOptions}
              style={{ width: 200, textAlign: "left" }}
            />
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
              Create
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        title="Error creating room"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false)
          setErrorIssues([])
        }}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsModalOpen(false)}>
            OK
          </Button>,
        ]}
      >
        {isServerError ? (
          <p>Something went wrong when communicating with the server.</p>
        ) : (
          errorIssues?.map((issue, index) => (
            <ErrorMessage
              key={index}
              path={issue.path}
              message={issue.message}
            />
          ))
        )}
      </Modal>
    </>
  )
}
