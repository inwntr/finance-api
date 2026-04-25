import { Router } from 'express'
import { DashboardController } from '../controllers/dashboardController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const dashboardRoutes = Router()
const dashboardController = new DashboardController()

dashboardRoutes.get('/summary', authMiddleware, dashboardController.summary)

export default dashboardRoutes