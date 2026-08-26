import { prisma } from '../config/prisma.js'

export class ReportController {
  async monthly(req, res) {
    try {
      const { month, year } = req.query

      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required' })
      }

      const startDate = new Date(Number(year), Number(month) - 1, 1)
      const endDate = new Date(Number(year), Number(month), 1)

      const dateFilter = {
        date: {
          gte: startDate,
          lt: endDate
        }
      }

      const incomes = await prisma.income.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        },
        orderBy: {
          date: 'desc'
        }
      })

      const expenses = await prisma.expense.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        },
        orderBy: {
          date: 'desc'
        }
      })

      const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0)
      const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0)

      const totalPaidExpenses = expenses
        .filter((item) => item.status === 'PAID')
        .reduce((sum, item) => sum + item.value, 0)

      const totalPendingExpenses = expenses
        .filter((item) => item.status === 'PENDING')
        .reduce((sum, item) => sum + item.value, 0)

      return res.status(200).json({
        period: {
          month: Number(month),
          year: Number(year)
        },
        summary: {
          totalIncomes,
          totalExpenses,
          totalPaidExpenses,
          totalPendingExpenses,
          balance: totalIncomes - totalExpenses
        },
        incomes,
        expenses
      })
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }
}
