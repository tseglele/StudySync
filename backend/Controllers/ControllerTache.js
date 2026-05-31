import pool from '../db.js'

// Algorithme de calcul du score de priorité
const calculerScore = (tache) => {
  let score = 0

  // 1. Priorité manuelle
  if (tache.priorite === 'Haute') score += 3
  else if (tache.priorite === 'Moyenne') score += 2
  else if (tache.priorite === 'Basse') score += 1

  // 2. Deadline
  if (tache.deadline) {
    const maintenant = new Date()
    const deadline = new Date(tache.deadline)
    const joursRestants = Math.ceil((deadline - maintenant) / (1000 * 60 * 60 * 24))

    if (joursRestants <= 0) score += 10      // Dépassée → critique
    else if (joursRestants <= 1) score += 8  // Moins d'1 jour
    else if (joursRestants <= 3) score += 6  // Moins de 3 jours
    else if (joursRestants <= 7) score += 4  // Moins d'1 semaine
    else if (joursRestants <= 14) score += 2 // Moins de 2 semaines
    else score += 1                          // Plus de 2 semaines
  }

  // 3. Statut
  if (tache.statut === 'todo') score += 2
  else if (tache.statut === 'in_progress') score += 1

  return score
}

const getNiveauPriorite = (score) => {
  if (score >= 12) return 'CRITIQUE'
  if (score >= 8) return 'URGENT'
  if (score >= 5) return 'NORMAL'
  return 'FAIBLE'
}

const getTachesByProjet = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM "Task" WHERE "projectId" = $1', [parseInt(id)])
    
    // Ajoute le score et le niveau à chaque tâche
    const tachesAvecScore = result.rows.map(tache => ({
      ...tache,
      score: calculerScore(tache),
      niveauPriorite: getNiveauPriorite(calculerScore(tache))
    }))

    // Trie par score décroissant
    tachesAvecScore.sort((a, b) => b.score - a.score)

    res.json(tachesAvecScore)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const createTache = async (req, res) => {
  try {
    const { id } = req.params
    const { titre, assignee, priorite, statut, deadline } = req.body
    const result = await pool.query(
      'INSERT INTO "Task" (titre, assignee, priorite, statut, "projectId", deadline) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titre, assignee, priorite, statut || 'todo', parseInt(id), deadline || null]
    )
    const tache = result.rows[0]
    res.status(201).json({
      ...tache,
      score: calculerScore(tache),
      niveauPriorite: getNiveauPriorite(calculerScore(tache))
    })
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
    const tache = result.rows[0]
    res.json({
      ...tache,
      score: calculerScore(tache),
      niveauPriorite: getNiveauPriorite(calculerScore(tache))
    })
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default { getTachesByProjet, createTache, updateStatutTache }