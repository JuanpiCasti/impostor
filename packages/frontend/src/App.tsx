import { BrowserRouter } from "react-router"
import { Routes, Route } from "react-router"
import ImpostorLayout from "./layout/ImpostorLayout"
import StartMenu from "./features/StartMenu"
import "@ant-design/v5-patch-for-react-19"
import RoomJoinForm from "./features/join-room/RoomJoinForm"
import GameRoom from "./features/game-room/GameRoom"
import RoomCreationForm from "./features/create-room/RoomCreationForm"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImpostorLayout />}>
          <Route index element={<StartMenu />} />
          <Route path="/create-room" element={<RoomCreationForm />} />
          <Route path="/join-room" element={<RoomJoinForm />} />
          <Route path="/room" element={<GameRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
