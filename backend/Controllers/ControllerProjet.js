import pool from '../db.js'

const getAllProjets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Project" ORDER BY "createdAt" DESC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const createProjet = async (req, res) => {
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
}

export default { getAllProjets, createProjet }
