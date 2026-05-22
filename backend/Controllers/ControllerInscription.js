    import pool from '../db.js'
    import bcrypt from 'bcryptjs'

    const register = async (req, res) => {
    const { email, password, name } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
        )
        res.status(201).json({ success: true, user: result.rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: 'Server error' })
    }
    }

    export default { register }