import express from 'express'
import ControllerInscription from '../Controllers/ControllerInscription.js'

const router = express.Router()

router.post('/register', ControllerInscription.register)

export default router