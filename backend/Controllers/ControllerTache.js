import pool from '../db.js'

const calculerScore = (tache) => {
  let score = 0

  if (tache.priorite === 'Haute') score += 3
  else if (tache.priorite === 'Moyenne') score += 2
  else if (tache.priorite === 'Basse') score += 1

  if (tache.deadline) {
    const maintenant = new Date()
    const deadline = new Date(tache.deadline)
    const joursRestants = Math.ceil((deadline - maintenant) / (1000 * 60 * 60 * 24))

    if (joursRestants <= 0) score += 10
    else if (joursRestants <= 1) score += 8
    else if (joursRestants <= 3) score += 6
    else if (joursRestants <= 7) score += 4
    else if (joursRestants <= 14) score += 2
    else score += 1
  }

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
    const result = await pool.query('SELECT * FROM "Task" WHERE "projectId" = $1' , [parseInt(id)])
    
    const tachesAvecScore = result.rows.map(tache => ({
      ...tache,
      score: calculerScore(tache),
      niveauPriorite: getNiveauPriorite(calculerScore(tache))
    }))

    tachesAvecScore.sort((a, b) => b.score - a.score)

    res.json(tachesAvecScore)
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

const createTache = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, assignee, statut = "todo", deadline = null } = req.body;

    // 1. récupérer le projet
    const projetResult = await pool.query(
      'SELECT * FROM "Project" WHERE id = $1',
      [parseInt(id)]
    );

    const projet = projetResult.rows[0];

    if (!projet) {
      return res.status(404).json({ error: "Projet introuvable" });
    }

    // 2. insert tâche
    const result = await pool.query(
      'INSERT INTO "Task" (titre, assignee, priorite, statut, "projectId", deadline) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titre, assignee, "Haute", statut, parseInt(id), deadline || null]
    );

    const tache = result.rows[0];

    const score = calculerScore(tache);
    const niveauPriorite = getNiveauPriorite(score);

    // 3. correction date compare
    if (tache.deadline && projet.dateLimite) {
      if (new Date(tache.deadline) > new Date(projet.dateLimite)) {
        return res.status(400).json({
          message: "La tâche dépasse la date limite du projet",
        });
      }
    }

    // 4. notification
    if (niveauPriorite === "CRITIQUE" || niveauPriorite === "URGENT") {
      await pool.query(
        'INSERT INTO notifications ("userId", message) VALUES ($1, $2)',
        [req.user?.id, `⚠️ Nouvelle tâche urgente : ${titre}`]
      );
    }

    res.status(201).json({ ...tache, score, niveauPriorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
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

const avecScore = (tache) => ({
  ...tache,
  score: calculerScore(tache),
  niveauPriorite: getNiveauPriorite(calculerScore(tache))
})
// ────────────────────────────────────────────────────────────────────────────
const updateTache = async (req, res) => {
  try {
    const { id } = req.params
    const { titre, assignee, deadline, priorite } = req.body

    const existing = await pool.query('SELECT * FROM "Task" WHERE id = $1', [parseInt(id)])
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Tâche introuvable" })
    }
    const ancienne = existing.rows[0]
    const projectId = ancienne.projectId ?? ancienne.projectid

    if (deadline && projectId) {
      const projetResult = await pool.query('SELECT * FROM "Project" WHERE id = $1', [projectId])
      const projet = projetResult.rows[0]
      const dateLimite = projet?.dateLimite ?? projet?.datelimite
      if (dateLimite && new Date(deadline) > new Date(dateLimite)) {
        return res.status(400).json({ message: "La deadline dépasse la date limite du projet" })
      }
    }

    const result = await pool.query(
      `UPDATE "Task"
       SET
         titre    = COALESCE($1, titre),
         assignee = COALESCE($2, assignee),
         deadline = COALESCE($3, deadline),
         priorite = COALESCE($4, priorite)
       WHERE id = $5
       RETURNING *`,
      [titre ?? null, assignee ?? null, deadline ?? null, priorite ?? null, parseInt(id)]
    )

    res.json(avecScore(result.rows[0]))
  } catch (error) {
    console.error('updateTache error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

const deleteTache = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM "Task" WHERE id = $1 RETURNING *',
      [parseInt(id)]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tâche introuvable" })
    }
    res.json({ success: true, deleted: result.rows[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}


export default { getTachesByProjet, createTache, updateStatutTache, updateTache, deleteTache }