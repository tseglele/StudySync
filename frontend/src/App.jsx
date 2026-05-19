import { Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"
import Planner from "./pages/Planner"
import Projects from "./pages/Projects"
import Groups from "./pages/Groups"

function App() {

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <Navbar />

        <Routes>

          <Route path="/" element={<Dashboard />} />

          <Route path="/planner" element={<Planner />} />

          <Route path="/projects" element={<Projects />} />

          <Route path="/groups" element={<Groups />} />

        </Routes>

      </div>

    </div>

  )
}

export default App