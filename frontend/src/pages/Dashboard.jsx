import { useEffect, useState } from "react"

function Dashboard() {

  const savedTasks =
    JSON.parse(localStorage.getItem("tasks")) || []

  const [tasks, setTasks] = useState(savedTasks)

  const [newTask, setNewTask] = useState("")

  const [filter, setFilter] = useState("all")

  useEffect(() => {

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    )

  }, [tasks])

  function addTask(){

    if(newTask === "") return

    const task = {

      id: Date.now(),

      title: newTask,

      completed: false,

      hour: new Date().toLocaleTimeString()

    }

    setTasks([...tasks, task])

    setNewTask("")

  }

  function deleteTask(id){

    const newTasks =
      tasks.filter(task => task.id !== id)

    setTasks(newTasks)

  }

  function completeTask(id){

    const updatedTasks = tasks.map(task => {

      if(task.id === id){

        return {

          ...task,

          completed: !task.completed

        }

      }

      return task

    })

    setTasks(updatedTasks)

  }

  let filteredTasks = tasks

  if(filter === "active"){

    filteredTasks =
      tasks.filter(task => !task.completed)

  }

  if(filter === "done"){

    filteredTasks =
      tasks.filter(task => task.completed)

  }

  const doneTasks =
    tasks.filter(task => task.completed).length

  return (

    <div
      style={{
        background:"#0f172a",
        minHeight:"100vh",
        padding:"40px",
        color:"white"
      }}
    >

      <h1>StudySync Dashboard</h1>

      {/* STATS */}

      <div
        style={{
          display:"flex",
          gap:"20px",
          marginTop:"30px"
        }}
      >

        <div
          style={{
            background:"#1e293b",
            padding:"20px",
            borderRadius:"10px",
            width:"150px"
          }}
        >

          <h2>{tasks.length}</h2>

          <p>Tâches</p>

        </div>

        <div
          style={{
            background:"#1e293b",
            padding:"20px",
            borderRadius:"10px",
            width:"150px"
          }}
        >

          <h2>{doneTasks}</h2>

          <p>Terminées</p>

        </div>

      </div>

      {/* INPUT */}

      <div
        style={{
          display:"flex",
          gap:"10px",
          marginTop:"30px"
        }}
      >

        <input

          type="text"

          placeholder="Ajouter une tâche"

          value={newTask}

          onChange={(e) => setNewTask(e.target.value)}

          onKeyDown={(e) => {

            if(e.key === "Enter"){

              addTask()

            }

          }}

          style={{
            padding:"12px",
            width:"300px",
            borderRadius:"10px",
            border:"none"
          }}
        />

        <button

          onClick={addTask}

          style={{
            background:"#9333ea",
            color:"white",
            border:"none",
            padding:"12px 20px",
            borderRadius:"10px",
            cursor:"pointer"
          }}
        >

          Ajouter

        </button>

      </div>

      {/* FILTERS */}

      <div
        style={{
          display:"flex",
          gap:"10px",
          marginTop:"20px"
        }}
      >

        <button onClick={() => setFilter("all")}>
          Toutes
        </button>

        <button onClick={() => setFilter("active")}>
          Actives
        </button>

        <button onClick={() => setFilter("done")}>
          Terminées
        </button>

      </div>

      {/* TASKS */}

      <div style={{marginTop:"30px"}}>

        {

          filteredTasks.length === 0 && (

            <p>Aucune tâche</p>

          )

        }

        {

          filteredTasks.map((task) => (

            <div

              key={task.id}

              style={{
                background:"#1e293b",
                padding:"15px",
                borderRadius:"10px",
                marginBottom:"15px",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center"
              }}
            >

              <div>

                <h3
                  style={{
                    textDecoration:
                      task.completed
                        ? "line-through"
                        : "none"
                  }}
                >

                  {task.title}

                </h3>

                <p
                  style={{
                    color:"gray"
                  }}
                >

                  {task.hour}

                </p>

              </div>

              <div
                style={{
                  display:"flex",
                  gap:"10px"
                }}
              >

                <button

                  onClick={() => completeTask(task.id)}

                  style={{
                    background:"#22c55e",
                    color:"white",
                    border:"none",
                    padding:"10px",
                    borderRadius:"10px",
                    cursor:"pointer"
                  }}
                >

                  ✅

                </button>

                <button

                  onClick={() => deleteTask(task.id)}

                  style={{
                    background:"#ef4444",
                    color:"white",
                    border:"none",
                    padding:"10px",
                    borderRadius:"10px",
                    cursor:"pointer"
                  }}
                >

                  ❌

                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  )

}

export default Dashboard