const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json())

/* DATABASE TEMPORAIRE */

let tasks = [

  {
    id: 1,
    title: "Projet React"
  },

  {
    id: 2,
    title: "UI Dashboard"
  }

]

/* GET TASKS */

app.get("/api/tasks", (req, res) => {

  res.json(tasks)

})

/* ADD TASK */

app.post("/api/tasks", (req, res) => {

  const newTask = {

    id: Date.now(),

    title: req.body.title

  }

  tasks.push(newTask)

  res.json(newTask)

})

/* SERVER */

app.listen(5000, () => {

  console.log("Server running on port 5000")

})