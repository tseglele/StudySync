import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import RouteConnexion from './routes/RouteConnexion.js'
import RouteInscription from './routes/RouteInscription.js'
import RouteProjet from './routes/RouteProjet.js'
import RouteTache from './routes/RouteTache.js'
import RouteGroupe from './routes/RouteGroupe.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', RouteConnexion)
app.use('/auth', RouteInscription)
app.use('/api/projets', RouteProjet)
app.use('/api/taches', RouteTache)
app.use('/api/groupes', RouteGroupe)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
