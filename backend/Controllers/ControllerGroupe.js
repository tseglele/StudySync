import pool from '../db.js'
import crypto from 'crypto'

const getGroupes = async (req, res) => {
  try {
    const { id } = req.user
    const result = await pool.query(
      `SELECT g.*,
        COALESCE(
          json_agg(json_build_object('id', u.id, 'name', u.name, 'email', u.email))
          FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) as membres
       FROM "Groupe" g
       LEFT JOIN "GroupeMembre" gm ON g.id = gm."groupeId"
       LEFT JOIN users u ON gm."userId" = u.id
       WHERE g.id IN (
         SELECT "groupeId" FROM "GroupeMembre" WHERE "userId" = $1
       )
       GROUP BY g.id
       ORDER BY g."createdAt" DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const createGroupe = async (req, res) => {
  try {
    const { id } = req.user
    const { nom, cours, emoji } = req.body

    const codeInvite = crypto.randomBytes(3).toString('hex').toUpperCase()

    const result = await pool.query(
      `INSERT INTO "Groupe" (nom, cours, emoji, "codeInvite", "createurId") 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nom, cours, emoji || '⬡', codeInvite, id]
    )

    const groupe = result.rows[0]

    await pool.query(
      `INSERT INTO "GroupeMembre" ("groupeId", "userId") VALUES ($1, $2)`,
      [groupe.id, id]
    )

    await pool.query(
      `INSERT INTO notifications ("userId", message) VALUES ($1, $2)`,
      [id, `Groupe "${nom}" créé ! Code d'invitation : ${codeInvite}`]
    )

    res.status(201).json({ ...groupe, membres: [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const rejoindreGroupe = async (req, res) => {
  try {
    const { id } = req.user
    const { code_invitation } = req.body

    const groupeRes = await pool.query(
      `SELECT * FROM "Groupe" WHERE "codeInvite" = $1`,
      [code_invitation]
    )

    if (groupeRes.rows.length === 0) {
      return res.status(404).json({ message: 'Code invalide' })
    }

    const groupe = groupeRes.rows[0]

    await pool.query(
      `INSERT INTO "GroupeMembre" ("groupeId", "userId") 
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [groupe.id, id]
    )

    res.json({ message: `Groupe "${groupe.nom}" rejoint !`, groupe })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getMembres = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT u.id, u.name, u.email 
       FROM users u
       JOIN "GroupeMembre" gm ON u.id = gm."userId"
       WHERE gm."groupeId" = $1`,
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getProjetsGroupe = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT * FROM "Project" WHERE "groupeId" = $1 ORDER BY "createdAt" DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const createProjetGroupe = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, description, dateLimite } = req.body
    const result = await pool.query(
      `INSERT INTO "Project" (nom, description, "dateLimite", "groupeId") 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, description, dateLimite, id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export default { getGroupes, createGroupe, rejoindreGroupe, getMembres, getProjetsGroupe, createProjetGroupe }