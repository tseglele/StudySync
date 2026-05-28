import express from 'express'
import ControllerTache from '../Controllers/ControllerTache.js'

const router = express.Router()

router.patch('/:id/statut', ControllerTache.updateStatutTache)

export default router
