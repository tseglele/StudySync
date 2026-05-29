import express from 'express'
import ControllerProfil from '../Controllers/ControllerProfil.js'

const router = express.Router()

router.get('/', ControllerProfil.getProfil)
router.patch('/', ControllerProfil.updateProfil)

export default router