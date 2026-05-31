import express from 'express'
import ControllerGroupe from '../Controllers/ControllerGroupe.js'
import verifyToken from '../middleware/authMiddleware.js'
const router = express.Router()

router.get('/', verifyToken, ControllerGroupe.getGroupes)
router.post('/', verifyToken, ControllerGroupe.createGroupe)
router.post('/rejoindre', verifyToken, ControllerGroupe.rejoindreGroupe)
router.get('/:id/membres', verifyToken, ControllerGroupe.getMembres)
router.get('/:id/projets', verifyToken, ControllerGroupe.getProjetsGroupe)
router.post('/:id/projets', verifyToken, ControllerGroupe.createProjetGroupe)
export default router