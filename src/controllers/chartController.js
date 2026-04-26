import { prisma } from '../config/prisma.js'

export class ChartController {
  async financialOverview(req, res) {
    try {
      const incomes = await prisma.income.findMany({
        where: { userId: req.userId }
      })

      const expenses = await prisma.expense.findMany({
        where: { userId: req.userId }
      })

      const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0)

      const totalPaid = expenses
        .filter(item => item.status === 'PAID')
        .reduce((sum, item) => sum + item.value, 0)
      
      const totalPending = expenses
        .filter(item => item.status === 'PENDING')
        .reduce((sum, item) => sum + item.value, 0)

      return res.status(200).json([
        { name: 'Entradas', value: totalIncomes },
        { name: 'Pagas', value: totalPaid },
        { name: 'Pendentes', value: totalPending }
      ])
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
