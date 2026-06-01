import express from 'express'
import ControllerTache from '../Controllers/ControllerTache.js'

const router = express.Router()

router.patch('/:id/statut', ControllerTache.updateStatutTache)
router.patch('/:id',        ControllerTache.updateTache)
router.delete('/:id',       ControllerTache.deleteTache)

export default router