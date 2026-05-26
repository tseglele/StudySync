import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import RouteConnexion from './routes/RouteConnexion.js'
import RouteInscription from './routes/RouteInscription.js'

dotenv.config({ path: '.env.local' })
const cors = require("cors");

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', RouteConnexion)
app.use('/auth', RouteInscription)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// ── ROUTES PROJETS ──

// GET tous les projets
app.get("/api/projets", async (req, res) => {
  try {
    // TODO: remplacer par vraies données BDD
    const projets = [
      { id: 1, nom: "Système distribué", description: "Implémentation en Java", avancement: 75, dateLimite: "30 mai" },
      { id: 2, nom: "Refonte UI Dashboard", description: "Redesign complet", avancement: 40, dateLimite: "15 juin" },
      { id: 3, nom: "Modèle de prédiction", description: "Modèle ML", avancement: 20, dateLimite: "20 juin" },
    ]
    res.json(projets)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// GET tâches d'un projet
app.get("/api/projets/:id/taches", async (req, res) => {
  try {
    const { id } = req.params
    // TODO: remplacer par vraies données BDD
    const taches = [
      { id: 1, titre: "Configurer les serveurs", statut: "done", priorite: "Haute", assignee: "AM", projectId: parseInt(id) },
      { id: 2, titre: "Implémenter les sockets", statut: "in_progress", priorite: "Haute", assignee: "SL", projectId: parseInt(id) },
      { id: 3, titre: "Tester la latence", statut: "todo", priorite: "Moyenne", assignee: "JD", projectId: parseInt(id) },
    ]
    res.json(taches)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// POST créer un projet
app.post("/api/projets", async (req, res) => {
  try {
    const { nom, description, dateLimite } = req.body
    // TODO: sauvegarder en BDD
    res.status(201).json({ message: "Projet créé", nom, description, dateLimite })
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// PATCH modifier le statut d'une tâche
app.patch("/api/taches/:id/statut", async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body
    // TODO: mettre à jour en BDD
    res.json({ message: "Statut mis à jour", id, statut })
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000")
})