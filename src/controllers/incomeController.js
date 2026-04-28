import { prisma } from '../config/prisma.js'

function parseLocalDate(date) {
  if (!date) return new Date()

  const [year, month, day] = date.split('-').map(Number)

  return new Date(year, month - 1, day, 12, 0, 0)
}

export class IncomeController {
  async create(req, res) {
    try {
      const { name, value, date, category } = req.body

      if (!name || !value) {
        return res.status(400).json({ message: 'Name and value are required' })
      }

      const income = await prisma.income.create({
        data: {
          name,
          value: Number(value),
          category,
          date: date ? parseLocalDate(date) : new Date(),
          userId: req.userId
        }
      })

      return res.status(201).json(income)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async list(req, res) {
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.status(200).json(incomes)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params

      const income = await prisma.income.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!income) {
        return res.status(404).json({ message: 'Income not found' })
      }

      await prisma.income.delete({
        where: { id }
      })

      return res.status(200).json({ message: 'Income removed successfully' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, value, date, category } = req.body

      const income = await prisma.income.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!income) {
        return res.status(404).json({ message: 'Income not found' })
      }

      const updatedIncome = await prisma.income.update({
        where: { id },
        data: {
          name,
          value: Number(value),
          category,
          date: date ? parseLocalDate(date) : income.date
        }
      })

      return res.status(200).json(updatedIncome)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}