import { Routes, Route } from 'react-router-dom'
import './App.css'
import PlannerPage from './pages/Planner/Planner'
import CalendarPage from './pages/Calendar/Calendar'

  

function App() {


  return (
  <Routes>
    <Route path="/calendar"  element={<CalendarPage/>} />
      <Route path="/planner"  element={<PlannerPage/>} />
    </Routes>
  )
}

export default App


