import { Router } from 'express'
import { ReportController } from '../controllers/ReportController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const reportRoutes = Router()
const reportController = new ReportController()

reportRoutes.get('/monthly', authMiddleware, reportController.monthly)

export { reportRoutes }