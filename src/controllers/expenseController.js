import { prisma } from '../config/prisma.js'

export class ExpenseController {
  async create(req, res) {
    try {
      const { name, value } = req.body

      if (!name || !value) {
        return res.status(400).json({ message: 'Name and value are required' })
      }

      const expense = await prisma.expense.create({
        data: {
          name,
          value: Number(value),
          userId: req.userId
        }
      })

      return res.status(201).json(expense)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async list(req, res) {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          userId: req.userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.status(200).json(expenses)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async markAsPaid(req, res) {
    try {
      const { id } = req.params

      const expense = await prisma.expense.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' })
      }

      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: {
          status: 'PAID'
        }
      })

      return res.status(200).json(updatedExpense)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async markAsPending(req, res) {
    try {
      const { id } = req.params

      const expense = await prisma.expense.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' })
      }

      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: {
          status: 'PENDING'
        }
      })

      return res.status(200).json(updatedExpense)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params

      const expense = await prisma.expense.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' })
      }

      await prisma.expense.delete({
        where: { id }
      })

      return res.status(200).json({ message: 'Expense removed successfully' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, value } = req.body

      const expense = await prisma.expense.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' })
      }

      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: {
          name,
          value: Number(value)
        }
      })

      return res.status(200).json(updatedExpense)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
