import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})


pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL connecté'))
  .catch(err => console.error('❌ PostgreSQL erreur :', err))


export default pool
