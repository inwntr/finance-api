import { prisma } from '../config/prisma.js'

export class ChartController {
  async financialOverview(req, res) {
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

      const totalPaid = expenses
        .filter(item => item.status === 'PAID')
        .reduce((sum, item) => sum + item.value, 0)

      const totalPending = expenses
        .filter(item => item.status === 'PENDING')
        .reduce((sum, item) => sum + item.value, 0)

      const expensesByCategory = expenses.reduce((acc, item) => {
        const category = item.category || 'Sem categoria'

        acc[category] = (acc[category] || 0) + item.value

        return acc
      }, {})

      const categoryData = Object.entries(expensesByCategory).map(
        ([name, value]) => ({
          name,
          value
        })
      )

      return res.status(200).json({
        overview: [
          { name: 'Entradas', value: totalIncomes },
          { name: 'Pagas', value: totalPaid },
          { name: 'Pendentes', value: totalPending }
        ],
        expensesByCategory: categoryData
      })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}