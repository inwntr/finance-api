import { Router } from 'express'
import { InsightController } from '../controllers/InsightController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const insightRoutes = Router()
const insightController = new InsightController()

insightRoutes.get('/', authMiddleware, insightController.list)

export default insightRoutes