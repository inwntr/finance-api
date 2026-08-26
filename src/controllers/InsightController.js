import { prisma } from '../config/prisma.js'

export class InsightController {
  async list(req, res) {
    try {
      const { month, year } = req.query
      const userId = req.userId

      const startDate = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0)
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59)

      const [incomes, expenses, budget, goals] = await Promise.all([
        prisma.income.findMany({
          where: {
            userId,
            date: {
              gte: startDate,
              lte: endDate
            }
          }
        }),

        prisma.expense.findMany({
          where: {
            userId,
            date: {
              gte: startDate,
              lte: endDate
            }
          }
        }),

        prisma.budget.findUnique({
          where: {
            month_year_userId: {
              month: Number(month),
              year: Number(year),
              userId
            }
          }
        }),

        prisma.goal.findMany({
          where: {
            userId
          }
        })
      ])

      const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0)
      const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0)
      const totalPendingExpenses = expenses
        .filter((item) => item.status === 'PENDING')
        .reduce((sum, item) => sum + item.value, 0)

      const balance = totalIncomes - totalExpenses

      const insights = []

      if (balance < 0) {
        insights.push({
          type: 'danger',
          title: 'Saldo negativo',
          message: 'Suas despesas passaram das entradas neste mês. Vale revisar os gastos variáveis.'
        })
      }

      if (totalExpenses > totalIncomes && totalIncomes > 0) {
        insights.push({
          type: 'warning',
          title: 'Gastos maiores que entradas',
          message: 'Você gastou mais do que recebeu neste mês.'
        })
      }

      if (budget) {
        const usedPercent = (totalExpenses / budget.amount) * 100

        if (usedPercent >= 100) {
          insights.push({
            type: 'danger',
            title: 'Orçamento ultrapassado',
            message: `Você já usou ${usedPercent.toFixed(0)}% do orçamento mensal.`
          })
        } else if (usedPercent >= 80) {
          insights.push({
            type: 'warning',
            title: 'Orçamento quase no limite',
            message: `Você já usou ${usedPercent.toFixed(0)}% do orçamento deste mês.`
          })
        } else {
          insights.push({
            type: 'success',
            title: 'Orçamento sob controle',
            message: `Você usou ${usedPercent.toFixed(0)}% do orçamento até agora.`
          })
        }
      }

      if (totalPendingExpenses > 0) {
        insights.push({
          type: 'warning',
          title: 'Contas pendentes',
          message: `Você ainda tem R$ ${totalPendingExpenses.toFixed(2)} em contas pendentes.`
        })
      }

      goals.forEach((goal) => {
        const progress = goal.targetAmount > 0
          ? (goal.currentAmount / goal.targetAmount) * 100
          : 0

        if (progress >= 100) {
          insights.push({
            type: 'success',
            title: 'Meta concluída',
            message: `Você concluiu a meta "${goal.name}".`
          })
        } else if (progress >= 80) {
          insights.push({
            type: 'success',
            title: 'Meta quase concluída',
            message: `A meta "${goal.name}" já está em ${progress.toFixed(0)}%.`
          })
        }
      })

      if (insights.length === 0) {
        insights.push({
          type: 'neutral',
          title: 'Tudo tranquilo',
          message: 'Ainda não há alertas importantes para este mês.'
        })
      }

      return res.json(insights)
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }
}
