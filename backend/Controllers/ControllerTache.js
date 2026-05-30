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
    const { id } = req.params;
    const {
      titre,
      assignee,
      priorite = "Moyenne",
      statut = "todo",
      deadline = null
    } = req.body;

    const result = await pool.query(
      `INSERT INTO "Task"
      (titre, assignee, priorite, statut, deadline, "projectId")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [titre, assignee, priorite, statut, deadline, parseInt(id)]
    );

    const newTask = result.rows[0];

    // 🔔 Notification AVANT response
    if (priorite === "Haute") {
      await pool.query(
        `INSERT INTO notifications ("userId", message)
         VALUES ($1, $2)`,
        [
          req.user?.id,
          `⚠️ Nouvelle tâche urgente : ${titre}`
        ]
      );
    }

    return res.status(201).json(newTask);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erreur serveur"
    });
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
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default { getTachesByProjet, createTache, updateStatutTache }
