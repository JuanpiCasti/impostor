import { BrowserRouter } from "react-router"
import { Routes, Route } from "react-router"
import ImpostorLayout from "./layout/ImpostorLayout"
import StartMenu from "./features/StartMenu"
import RoomCreationForm from "./features/create-room/RoomCreationForm"
import "@ant-design/v5-patch-for-react-19"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImpostorLayout />}>
          <Route index element={<StartMenu />} />
          <Route path="/create-room" element={<RoomCreationForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
