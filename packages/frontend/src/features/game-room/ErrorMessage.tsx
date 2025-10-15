import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Card } from "antd";

export default function ErrorMessage({message}: {message: string}) {
    return (<Card
      title="Error."
      variant="borderless"
      style={{ width: 300 }}
    >
    <ExclamationCircleOutlined style={{fontSize:"3rem", color:"red"}}/>
    <p>{message}</p>
    </Card>)
}