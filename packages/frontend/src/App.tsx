import {BrowserRouter} from 'react-router'
import CounterPage from './features/counter/CounterPage'
import { Routes, Route } from 'react-router'

function App() {

  return (
  <BrowserRouter>
  <Routes>
    <Route path = "/counter" element={<CounterPage/>}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App
