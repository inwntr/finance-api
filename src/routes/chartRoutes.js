import { Router } from 'express'
import { ChartController } from '../controllers/chartController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const chartRoutes = Router()
const chartController = new ChartController()

chartRoutes.get('/financial-overview', authMiddleware, chartController.financialOverview)

export default chartRoutes