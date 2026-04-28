import { Router } from 'express'
import { ReportController } from '../controllers/reportController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const reportRoutes = Router()
const controller = new ReportController()

reportRoutes.get('/monthly', authMiddleware, controller.monthly)

export { reportRoutes }
