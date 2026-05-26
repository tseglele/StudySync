import { useState } from "react"

function Projects() {

  const [projects, setProjects] = useState([

    {
      id: 1,
      title: "Application React",
      status: "En cours"
    },

    {
      id: 2,
      title: "Dashboard UI",
      status: "Terminé"
    }

  ])

  const [newProject, setNewProject] = useState("")

  function addProject(){

    if(newProject === "") return

    const project = {

      id: Date.now(),

      title: newProject,

      status: "En cours"

    }

    setProjects([...projects, project])

    setNewProject("")

  }

  function deleteProject(id){

    const updatedProjects =
      projects.filter(project => project.id !== id)

    setProjects(updatedProjects)

  }

  return (

    <div
      style={{
        background:"#0f172a",
        minHeight:"100vh",
        padding:"40px",
        color:"white"
      }}
    >

      <h1>Projects 📁</h1>

      {/* INPUT */}

      <div
        style={{
          display:"flex",
          gap:"10px",
          marginTop:"20px"
        }}
      >

        <input

          type="text"

          placeholder="Ajouter un projet"

          value={newProject}

          onChange={(e)=> setNewProject(e.target.value)}

          style={{
            padding:"12px",
            width:"300px",
            borderRadius:"10px",
            border:"none"
          }}
        />

        <button

          onClick={addProject}

          style={{
            padding:"12px 20px",
            border:"none",
            borderRadius:"10px",
            background:"#9333ea",
            color:"white",
            cursor:"pointer"
          }}
        >

          Ajouter

        </button>

      </div>

      {/* PROJECTS */}

      <div style={{marginTop:"30px"}}>

        {

          projects.map((project)=>(

            <div

              key={project.id}

              style={{
                background:"#1e293b",
                padding:"20px",
                borderRadius:"12px",
                marginBottom:"15px",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center"
              }}
            >

              <div>

                <h3>{project.title}</h3>

                <p>{project.status}</p>

              </div>

              <button

                onClick={()=> deleteProject(project.id)}

                style={{
                  background:"#ef4444",
                  color:"white",
                  border:"none",
                  padding:"10px",
                  borderRadius:"10px",
                  cursor:"pointer"
                }}
              >

                Supprimer

              </button>

            </div>

          ))

        }

      </div>

    </div>

  )

}

export default Projects