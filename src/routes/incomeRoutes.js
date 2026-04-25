import { Router } from 'express'
import { IncomeController } from '../controllers/incomeController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const incomeRoutes = Router()
const incomeController = new IncomeController()

incomeRoutes.post('/', authMiddleware, incomeController.create)
incomeRoutes.get('/', authMiddleware, incomeController.list)
incomeRoutes.delete('/:id', authMiddleware, incomeController.remove)
incomeRoutes.patch('/:id', authMiddleware, incomeController.update)

export default incomeRoutes