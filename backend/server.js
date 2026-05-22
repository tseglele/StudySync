import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import RouteConnexion from './routes/RouteConnexion.js'
import RouteInscription from './routes/RouteInscription.js'

dotenv.config({ path: '.env.local' })

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', RouteConnexion)
app.use('/auth', RouteInscription)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})