import { useEffect, useState } from "react"

function Dashboard() {

  const savedTasks =
    JSON.parse(localStorage.getItem("tasks")) || []

  const [tasks, setTasks] = useState(savedTasks)

  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [taskType, setTaskType] = useState("Exercice")
  const [groupWork, setGroupWork] = useState(false)

  useEffect(() => {

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    )

  }, [tasks])

  function getPriority(task) {

    let score = 0

    const today = new Date()
    const dueDate = new Date(task.deadline)

    const diffTime = dueDate - today

    const diffDays =
      Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Date d'échéance

    if (diffDays <= 2) {

      score += 3

    } else if (diffDays <= 7) {

      score += 2

    }

    // Type de tâche

    if (task.type === "Projet") {

      score += 2

    } else if (task.type === "Présentation") {

      score += 1

    }

    // Travail en groupe

    if (task.groupWork) {

      score += 1

    }

    if (score >= 5) {

      return "Urgent"

    }

    if (score >= 3) {

      return "Moyen"

    }

    return "Normal"

  }

  function addTask() {

    if (
      title === "" ||
      deadline === ""
    ) {
      return
    }

    const newTask = {

      id: Date.now(),

      title: title,

      deadline: deadline,

      type: taskType,

      groupWork: groupWork,

      completed: false

    }

    setTasks([...tasks, newTask])

    setTitle("")
    setDeadline("")
    setTaskType("Exercice")
    setGroupWork(false)

  }

  function deleteTask(id) {

    const updatedTasks =
      tasks.filter(task => task.id !== id)

    setTasks(updatedTasks)

  }

  function completeTask(id) {

    const updatedTasks = tasks.map(task => {

      if (task.id === id) {

        return {

          ...task,

          completed: !task.completed

        }

      }

      return task

    })

    setTasks(updatedTasks)

  }

  const completedTasks =
    tasks.filter(task => task.completed).length

  const urgentTasks =
    tasks.filter(task =>
      getPriority(task) === "Urgent"
    ).length

  const progress =
    tasks.length > 0
      ? Math.round(
          (completedTasks / tasks.length) * 100
        )
      : 0

  return (

    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: "40px",
        color: "white"
      }}
    >

      <h1>StudySync Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "30px",
          marginBottom: "30px"
        }}
      >

        <div>
          <h2>{tasks.length}</h2>
          <p>Tâches</p>
        </div>

        <div>
          <h2>{completedTasks}</h2>
          <p>Terminées</p>
        </div>

        <div>
          <h2>{urgentTasks}</h2>
          <p>Urgentes</p>
        </div>

        <div>
          <h2>{progress}%</h2>
          <p>Progression</p>
        </div>

      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px"
        }}
      >

        <input
          type="text"
          placeholder="Nom de la tâche"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) =>
            setDeadline(e.target.value)
          }
        />

        <select
          value={taskType}
          onChange={(e) =>
            setTaskType(e.target.value)
          }
        >

          <option>
            Exercice
          </option>

          <option>
            Présentation
          </option>

          <option>
            Projet
          </option>

        </select>

        <label>

          <input
            type="checkbox"
            checked={groupWork}
            onChange={(e) =>
              setGroupWork(e.target.checked)
            }
          />

          Travail en groupe

        </label>

        <button onClick={addTask}>
          Ajouter
        </button>

      </div>

      <div
        style={{
          marginTop: "40px"
        }}
      >

        {

          tasks.map(task => (

            <div

              key={task.id}

              style={{
                background: "#1e293b",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px"
              }}
            >

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

              <p>
                Échéance : {task.deadline}
              </p>

              <p>
                Type : {task.type}
              </p>

              <p>
                Groupe :
                {task.groupWork
                  ? " Oui"
                  : " Non"}
              </p>

              <p>
                Priorité :
                {" "}
                {getPriority(task)}
              </p>

              <button
                onClick={() =>
                  completeTask(task.id)
                }
              >
                ✅
              </button>

              <button
                onClick={() =>
                  deleteTask(task.id)
                }
              >
                ❌
              </button>

            </div>

          ))

        }

      </div>

    </div>

  )

}

export default Dashboard