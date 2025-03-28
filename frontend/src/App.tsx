import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Call from './pages/Call'

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
