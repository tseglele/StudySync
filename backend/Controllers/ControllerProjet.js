import pool from '../db.js'

const getAllProjets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT p.* FROM "Project" p
       LEFT JOIN "GroupeMembre" gm ON p."groupeId" = gm."groupeId"
       WHERE p."userId" = $1
          OR (gm."userId" = $1 AND p."groupeId" IS NOT NULL)
       ORDER BY p."createdAt" DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const createProjet = async (req, res) => {
  try {
    const { nom, description, dateLimite } = req.body
    const result = await pool.query(
      `INSERT INTO "Project" (nom, description, "dateLimite", "userId")
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, description, dateLimite, req.user.id]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const updateProjet = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, description, dateLimite } = req.body
    const result = await pool.query(
      `UPDATE "Project" SET nom = $1, description = $2, "dateLimite" = $3
       WHERE id = $4 AND "userId" = $5 RETURNING *`,
      [nom, description, dateLimite, id, req.user.id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Projet introuvable" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const deleteProjet = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM "Task" WHERE "projectId" = $1`, [id])
    await pool.query(
      `DELETE FROM "Project" WHERE id = $1 AND "userId" = $2`,
      [id, req.user.id]
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default { getAllProjets, createProjet, updateProjet, deleteProjet }