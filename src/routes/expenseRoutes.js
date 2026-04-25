import { Router } from 'express'
import { ExpenseController } from '../controllers/expenseController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const expenseRoutes = Router()
const expenseController = new ExpenseController()

expenseRoutes.post('/', authMiddleware, expenseController.create)
expenseRoutes.get('/', authMiddleware, expenseController.list)
expenseRoutes.patch('/:id/pay', authMiddleware, expenseController.markAsPaid)
expenseRoutes.patch('/:id/pending', authMiddleware, expenseController.markAsPending)
expenseRoutes.delete('/:id', authMiddleware, expenseController.remove)
expenseRoutes.patch('/:id', authMiddleware, expenseController.update)

export default expenseRoutes