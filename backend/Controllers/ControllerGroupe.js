import pool from '../db.js'
import crypto from 'crypto'

const getGroupes = async (req, res) => {
  try {
    const { id } = req.user
    const result = await pool.query(
      `SELECT g.*, COUNT(gm.user_id) as nb_membres 
       FROM groupes g
       LEFT JOIN groupe_membres gm ON g.id = gm.groupe_id
       WHERE g.id IN (SELECT groupe_id FROM groupe_membres WHERE user_id = $1)
       GROUP BY g.id`,
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

    // Génère un code unique de 6 caractères
    const code_invitation = crypto.randomBytes(3).toString('hex').toUpperCase()

    const result = await pool.query(
      'INSERT INTO groupes (nom, cours, emoji, code_invitation, createur_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nom, cours, emoji, code_invitation, id]
    )

    const groupe = result.rows[0]

    // Ajoute le créateur comme membre
    await pool.query(
      'INSERT INTO groupe_membres (groupe_id, user_id) VALUES ($1, $2)',
      [groupe.id, id]
    )

    // Envoie une notification avec le code
    await pool.query(
      'INSERT INTO notifications ("userId", message) VALUES ($1, $2)',
      [id, `Groupe "${nom}" créé ! Code d'invitation : ${code_invitation}`]
    )

    res.status(201).json(groupe)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const rejoindreGroupe = async (req, res) => {
  try {
    const { id } = req.user
    const { code_invitation } = req.body

    const groupe = await pool.query(
      'SELECT * FROM groupes WHERE code_invitation = $1',
      [code_invitation]
    )

    if (groupe.rows.length === 0) {
      return res.status(404).json({ message: 'Code invalide' })
    }

    await pool.query(
      'INSERT INTO groupe_membres (groupe_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupe.rows[0].id, id]
    )

    res.json({ message: 'Groupe rejoint !', groupe: groupe.rows[0] })
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
       JOIN groupe_membres gm ON u.id = gm.user_id
       WHERE gm.groupe_id = $1`,
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
      'SELECT * FROM "Project" WHERE groupe_id = $1 ORDER BY "createdAt" DESC',
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
      'INSERT INTO "Project" (nom, description, "dateLimite", groupe_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, description, dateLimite, id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export default { getGroupes, createGroupe, rejoindreGroupe, getMembres, getProjetsGroupe, createProjetGroupe }

