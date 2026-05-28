import pool from '../db.js'

const getTachesByProjet = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM "Task" WHERE "projectId" = $1', [parseInt(id)])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const createTache = async (req, res) => {
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
}

const updateStatutTache = async (req, res) => {
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
}

export default { getTachesByProjet, createTache, updateStatutTache }
