import express from 'express'
import ControllerConnexion from '../Controllers/ControllerConnexion.js'

const router = express.Router()

router.post('/login', ControllerConnexion.login)

export default router