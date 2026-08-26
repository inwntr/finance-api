import { prisma } from '../config/prisma.js'

export class BudgetController {
  async upsert(req, res) {
    try {
      const { month, year, amount } = req.body

      if (!month || !year || !amount) {
        return res.status(400).json({ message: 'Month, year and amount are required' })
      }

      const budget = await prisma.budget.upsert({
        where: {
          month_year_userId: {
            month: Number(month),
            year: Number(year),
            userId: req.userId
          }
        },
        update: {
          amount: Number(amount)
        },
        create: {
          month: Number(month),
          year: Number(year),
          amount: Number(amount),
          userId: req.userId
        }
      })

      return res.json(budget)
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }

  async getByMonth(req, res) {
    try {
      const { month, year } = req.query

      const budget = await prisma.budget.findUnique({
        where: {
          month_year_userId: {
            month: Number(month),
            year: Number(year),
            userId: req.userId
          }
        }
      })

      return res.json(budget)
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }

  async delete(req, res) {
    try {
      const { month, year } = req.query

      await prisma.budget.delete({
        where: {
          month_year_userId: {
            month: Number(month),
            year: Number(year),
            userId: req.userId
          }
        }
      })

      return res.json({ message: 'Budget deleted successfully' })
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }
}
