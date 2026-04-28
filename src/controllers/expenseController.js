import { prisma } from '../config/prisma.js'

function parseLocalDate(date) {
  if (!date) return new Date()

  const [year, month, day] = date.split('-').map(Number)

  return new Date(year, month - 1, day, 12, 0, 0)
}

function getMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function createRecurringDate(year, month, day) {
  const lastDayOfMonth = new Date(year, month, 0).getDate()
  const safeDay = Math.min(Number(day), lastDayOfMonth)

  return new Date(year, month - 1, safeDay, 12, 0, 0)
}

export class ExpenseController {
  async create(req, res) {
    try {
      const {
        name,
        value,
        date,
        category,
        isRecurring,
        recurrenceDay
      } = req.body

      if (!name || !value) {
        return res.status(400).json({ message: 'Name and value are required' })
      }

      const expenseDate = date ? parseLocalDate(date) : new Date()
      const monthKey = getMonthKey(
        expenseDate.getFullYear(),
        expenseDate.getMonth() + 1
      )

      const expense = await prisma.expense.create({
        data: {
          name,
          value: Number(value),
          category,
          date: expenseDate,
          userId: req.userId,
          isRecurring: Boolean(isRecurring),
          recurrenceDay: isRecurring
            ? Number(recurrenceDay || expenseDate.getDate())
            : null,
          lastGenerated: isRecurring ? monthKey : null
        }
      })

      return res.status(201).json(expense)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async list(req, res) {
    try {
      const { month, year } = req.query

      let dateFilter = {}

      if (month && year) {
        const numericMonth = Number(month)
        const numericYear = Number(year)
        const currentMonthKey = getMonthKey(numericYear, numericMonth)

        const recurringExpenses = await prisma.expense.findMany({
          where: {
            userId: req.userId,
            isRecurring: true
          }
        })

        for (const expense of recurringExpenses) {
          if (expense.lastGenerated === currentMonthKey) {
            continue
          }

          const generatedDate = createRecurringDate(
            numericYear,
            numericMonth,
            expense.recurrenceDay || expense.date.getDate()
          )

          await prisma.expense.create({
            data: {
              name: expense.name,
              value: expense.value,
              category: expense.category,
              date: generatedDate,
              status: 'PENDING',
              userId: req.userId,
              isRecurring: false,
              recurrenceDay: null,
              lastGenerated: null
            }
          })

          await prisma.expense.update({
            where: { id: expense.id },
            data: {
              lastGenerated: currentMonthKey
            }
          })
        }

        const startDate = new Date(numericYear, numericMonth - 1, 1)
        const endDate = new Date(numericYear, numericMonth, 1)

        dateFilter = {
          date: {
            gte: startDate,
            lt: endDate
          }
        }
      }

      const expenses = await prisma.expense.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
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
      const {
        name,
        value,
        date,
        category,
        isRecurring,
        recurrenceDay
      } = req.body

      const expense = await prisma.expense.findFirst({
        where: {
          id,
          userId: req.userId
        }
      })

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' })
      }

      const updatedDate = date ? parseLocalDate(date) : expense.date
      const updatedIsRecurring =
        typeof isRecurring === 'boolean' ? isRecurring : expense.isRecurring

      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: {
          name,
          value: Number(value),
          category,
          date: updatedDate,
          isRecurring: updatedIsRecurring,
          recurrenceDay: updatedIsRecurring
            ? Number(recurrenceDay || updatedDate.getDate())
            : null,
          lastGenerated: updatedIsRecurring
            ? expense.lastGenerated ||
              getMonthKey(updatedDate.getFullYear(), updatedDate.getMonth() + 1)
            : null
        }
      })

      return res.status(200).json(updatedExpense)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}