import { Routes, Route, BrowserRouter } from "react-router-dom"
import './App.css'
import MusicPage from './pages/MusicPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/music' element={<MusicPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
