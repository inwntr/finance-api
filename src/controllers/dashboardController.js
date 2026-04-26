import { prisma } from '../config/prisma.js'

export class DashboardController {
  async summary(req, res) {
    try {
      const incomes = await prisma.income.findMany({
        where: { userId: req.userId }
      })

      const expenses = await prisma.expense.findMany({
        where: { userId: req.userId }
      })

      const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0)

      const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0)

      const totalPaidExpenses = expenses
        .filter(item => item.status === 'PAGO')
        .reduce((sum, item) => sum + item.value, 0)

      const totalPendingExpenses = expenses
        .filter(item => item.status === 'PENDENTE')
        .reduce((sum, item) => sum + item.value, 0)

      const currentBalance = totalIncomes - totalPaidExpenses

      return res.status(200).json({
        totalIncomes,
        totalExpenses,
        totalPaidExpenses,
        totalPendingExpenses,
        currentBalance,
        balanceStatus: currentBalance > 0 ? 'POSITIVE' : 'NEGATIVE_OR_ZERO',
        alert: currentBalance <= 0
      })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
