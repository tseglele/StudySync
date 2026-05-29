import pool from '../db.js'

const getNotifications = async (req, res) => {
  try {
    const { id } = req.user
    const result = await pool.query(
      'SELECT * FROM notifications WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [id]
    )
    res.json({ success: true, notifications: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const marquerLu = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'UPDATE notifications SET lu = TRUE WHERE id = $1 RETURNING *',
      [id]
    )
    res.json({ success: true, notification: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export default { getNotifications, marquerLu }