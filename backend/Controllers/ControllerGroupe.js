import pool from '../db.js'

const getAllGroupes = async (req, res) => {
  try {
    const groupes = await pool.query('SELECT * FROM "Groupe" ORDER BY "createdAt" DESC')
    
    const groupesAvecMembres = await Promise.all(
      groupes.rows.map(async (groupe) => {
        const membres = await pool.query(
          'SELECT u.name, u.email FROM "GroupeMembre" gm JOIN users u ON gm."userId" = u.id WHERE gm."groupeId" = $1',
          [groupe.id]
        )
        return { ...groupe, membres: membres.rows }
      })
    )
    
    res.json(groupesAvecMembres)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const createGroupe = async (req, res) => {
  try {
    const { nom, cours, emoji } = req.body
    const result = await pool.query(
      'INSERT INTO "Groupe" (nom, cours, emoji) VALUES ($1, $2, $3) RETURNING *',
      [nom, cours, emoji || '⬡']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default { getAllGroupes, createGroupe }
