import express from 'express'
import ControllerNotifications from '../Controllers/ControllerNotifications.js'

const router = express.Router()

router.get('/', ControllerNotifications.getNotifications)
router.patch('/:id/lu', ControllerNotifications.marquerLu)

export default router