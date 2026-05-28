import { Routes, Route } from 'react-router-dom'
import './App.css'
import Planner from './pages/Planner/Planner'

  

function App() {


  return (
  <Routes>
      <Route path="/planner"  element={<Planner/>} />
    </Routes>
  )
}

export default App


