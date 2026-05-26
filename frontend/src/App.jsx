import { useState } from "react"

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Planner from "./pages/Planner"
import Groups from "./pages/Groups"

function App(){

  const [page, setPage] = useState("dashboard")

  return (

    <div
      style={{
        background:"#020617",
        minHeight:"100vh",
        color:"white"
      }}
    >

      {/* NAVBAR */}

      <div
        style={{
          display:"flex",
          gap:"15px",
          padding:"20px",
          borderBottom:"1px solid #1e293b"
        }}
      >

        <button onClick={()=> setPage("dashboard")}>
          Dashboard
        </button>

        <button onClick={()=> setPage("projects")}>
          Projects
        </button>

        <button onClick={()=> setPage("planner")}>
          Planner
        </button>

        <button onClick={()=> setPage("groups")}>
          Groups
        </button>

      </div>

      {/* PAGES */}

      {

        page === "dashboard" && <Dashboard />

      }

      {

        page === "projects" && <Projects />

      }

      {

        page === "planner" && <Planner />

      }

      {

        page === "groups" && <Groups />

      }

    </div>

  )

}

export default App