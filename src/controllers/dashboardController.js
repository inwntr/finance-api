import { prisma } from '../config/prisma.js'

export class DashboardController {
  async summary(req, res) {
    try {
      const { month, year } = req.query

      let dateFilter = {}

      if (month && year) {
        const startDate = new Date(Number(year), Number(month) - 1, 1)
        const endDate = new Date(Number(year), Number(month), 1)

        dateFilter = {
          date: {
            gte: startDate,
            lt: endDate
          }
        }
      }

      const incomes = await prisma.income.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        }
      })

      const expenses = await prisma.expense.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        }
      })

      const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0)

      const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0)

      const totalPaidExpenses = expenses
        .filter(item => item.status === 'PAID')
        .reduce((sum, item) => sum + item.value, 0)

      const totalPendingExpenses = expenses
        .filter(item => item.status === 'PENDING')
        .reduce((sum, item) => sum + item.value, 0)

      const currentBalance = totalIncomes - totalPaidExpenses

      return res.status(200).json({
        totalIncomes,
        totalExpenses,
        totalPaidExpenses,
        totalPendingExpenses,
        currentBalance,
        balanceStatus: currentBalance > 0 ? 'POSITIVE' : 'NEGATIVE_OR_ZERO',
        alert: currentBalance <= 0,
        filter: month && year ? { month: Number(month), year: Number(year) } : null
      })
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }
}
