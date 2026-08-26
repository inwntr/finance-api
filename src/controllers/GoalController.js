import { prisma } from '../config/prisma.js'

function parseLocalDate(date) {
  if (!date) return null

  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}

export class GoalController {
  async create(req, res) {
    try {
      const { name, targetAmount, currentAmount, deadline } = req.body

      if (!name || !targetAmount) {
        return res.status(400).json({ message: 'Name and target amount are required' })
      }

      const goal = await prisma.goal.create({
        data: {
          name,
          targetAmount: Number(targetAmount),
          currentAmount: currentAmount ? Number(currentAmount) : 0,
          deadline: deadline ? parseLocalDate(deadline) : null,
          userId: req.userId
        }
      })

      return res.status(201).json(goal)
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }

  async list(req, res) {
    try {
      const goals = await prisma.goal.findMany({
        where: {
          userId: req.userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.json(goals)
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, targetAmount, currentAmount, deadline } = req.body

      const goal = await prisma.goal.update({
        where: {
          id: Number(id),
          userId: req.userId
        },
        data: {
          name,
          targetAmount: targetAmount ? Number(targetAmount) : undefined,
          currentAmount: currentAmount !== undefined ? Number(currentAmount) : undefined,
          deadline: deadline ? parseLocalDate(deadline) : undefined
        }
      })

      return res.json(goal)
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      await prisma.goal.delete({
        where: {
          id: Number(id),
          userId: req.userId
        }
      })

      return res.json({ message: 'Goal deleted successfully' })
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }
}
