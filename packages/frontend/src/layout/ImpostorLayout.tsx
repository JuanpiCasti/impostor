import { Layout } from "antd"
import { Content, Footer, Header } from "antd/es/layout/layout"
import { colors } from "../theme/colors"
import { Outlet } from "react-router"
import "./ImpostorLayout.css"

const layoutStyle = {
  width: "100%",
  backgroundColor: colors.backgroundColor,
}

const headerStyle = {
  height: "100px",
  background: "none",
}

export default function ImpostorLayout() {
  return (
    <Layout className="layout" style={layoutStyle}>
      <Header style={headerStyle}>
        <h1 className="game-title">IMPOSTOR</h1>
      </Header>
      <Content className="content">
        <Outlet />
      </Content>
      <Footer className="footer">
        <p>Impostor Game</p>
      </Footer>
    </Layout>
  )
}
