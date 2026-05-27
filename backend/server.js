const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

/* MONGODB */

mongoose.connect("mongodb://127.0.0.1:27017/studysync")

.then(() => {

  console.log("MongoDB connecté")

})

.catch((err) => {

  console.log(err)

})

/* TASK MODEL */

const taskSchema = new mongoose.Schema({

  title: String,

  completed: {

    type: Boolean,

    default: false

  }

})

const Task = mongoose.model("Task", taskSchema)

/* GET TASKS */

app.get("/api/tasks", async (req, res) => {

  const tasks = await Task.find()

  res.json(tasks)

})

/* ADD TASK */

app.post("/api/tasks", async (req, res) => {

  const newTask = new Task({

    title: req.body.title

  })

  await newTask.save()

  res.json(newTask)

})

/* DELETE TASK */

app.delete("/api/tasks/:id", async (req, res) => {

  await Task.findByIdAndDelete(req.params.id)

  res.json({

    message: "Task deleted"

  })

})

/* COMPLETE TASK */

app.put("/api/tasks/:id", async (req, res) => {

  const task = await Task.findById(req.params.id)

  task.completed = !task.completed

  await task.save()

  res.json(task)

})

/* SERVER */

app.listen(5000, () => {

  console.log("Server running on port 5000")

})