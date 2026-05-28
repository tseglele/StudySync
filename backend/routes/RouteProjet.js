import express from 'express'
import ControllerProjet from '../Controllers/ControllerProjet.js'
import ControllerTache from '../Controllers/ControllerTache.js'

const router = express.Router()

router.get('/', ControllerProjet.getAllProjets)
router.post('/', ControllerProjet.createProjet)
router.get('/:id/taches', ControllerTache.getTachesByProjet)
router.post('/:id/taches', ControllerTache.createTache)

export default router
