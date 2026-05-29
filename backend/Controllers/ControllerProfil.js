import pool from '../db.js'
import bcrypt from 'bcryptjs'

const getProfil = async (req, res) => {
  try {
    const { id } = req.user
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    )
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const updateProfil = async (req, res) => {
  try {
    const { id } = req.user
    const { name, password } = req.body

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await pool.query(
        'UPDATE users SET name = $1, password = $2 WHERE id = $3',
        [name, hashedPassword, id]
      )
    } else {
      await pool.query(
        'UPDATE users SET name = $1 WHERE id = $2',
        [name, id]
      )
    }

    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id]
    )
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export default { getProfil, updateProfil }