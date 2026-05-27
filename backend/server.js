import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import RouteConnexion from './routes/RouteConnexion.js'
import RouteInscription from './routes/RouteInscription.js'
import pool from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', RouteConnexion)
app.use('/auth', RouteInscription)

const PORT = process.env.PORT || 3000

// GET tous les projets
app.get("/api/projets", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Project" ORDER BY "createdAt" DESC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// GET tâches d'un projet
app.get("/api/projets/:id/taches", async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM "Task" WHERE "projectId" = $1', [parseInt(id)])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// POST créer un projet
app.post("/api/projets", async (req, res) => {
  try {
    const { nom, description, dateLimite } = req.body
    const result = await pool.query(
      'INSERT INTO "Project" (nom, description, "dateLimite") VALUES ($1, $2, $3) RETURNING *',
      [nom, description, dateLimite]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// POST créer une tâche
app.post("/api/projets/:id/taches", async (req, res) => {
  try {
    const { id } = req.params
    const { titre, assignee, priorite, statut } = req.body
    const result = await pool.query(
      'INSERT INTO "Task" (titre, assignee, priorite, statut, "projectId") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titre, assignee, priorite, statut || 'todo', parseInt(id)]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// PATCH modifier le statut d'une tâche
app.patch("/api/taches/:id/statut", async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body
    const result = await pool.query(
      'UPDATE "Task" SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, parseInt(id)]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})