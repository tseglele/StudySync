import express from 'express'
import ControllerGroupe from '../Controllers/ControllerGroupe.js'

const router = express.Router()

router.get('/', ControllerGroupe.getAllGroupes)
router.post('/', ControllerGroupe.createGroupe)

export default router
