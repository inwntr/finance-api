import { Router } from 'express'
import { BudgetController } from '../controllers/BudgetController.js'
import { GoalController } from '../controllers/GoalController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const routes = Router()

const budgetController = new BudgetController()
const goalController = new GoalController()

routes.post('/budgets', authMiddleware, budgetController.upsert)
routes.get('/budgets', authMiddleware, budgetController.getByMonth)

routes.post('/goals', authMiddleware, goalController.create)
routes.get('/goals', authMiddleware, goalController.list)
routes.put('/goals/:id', authMiddleware, goalController.update)
routes.delete('/goals/:id', authMiddleware, goalController.delete)
routes.delete('/budgets', authMiddleware, budgetController.delete)

export default routes