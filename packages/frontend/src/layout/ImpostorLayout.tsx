import { Layout } from "antd"
import { Content, Footer, Header } from "antd/es/layout/layout"
import { Outlet } from "react-router"
import "./ImpostorLayout.css"
import { Link } from "react-router"
import AdSense from "../components/AdSense"

const layoutStyle = {
  width: "100%",
}

const headerStyle = {
  height: "100px",
  background: "none",
}

export default function ImpostorLayout() {
  return (
    <Layout className="layout" style={layoutStyle}>
      <Header style={headerStyle} className="layout-header">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="game-title">IMPOSTOR</h1>
        </Link>
      </Header>
      <div style={{ margin: "20px auto", maxWidth: "728px" }}>
        <AdSense />
      </div>
      <Content className="content">
        <Outlet />
      </Content>
      <Footer className="footer">
        <p>Impostor Game</p>
      </Footer>
    </Layout>
  )
}
