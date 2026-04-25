import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import chartRoutes from './routes/chartRoutes.js'

dotenv.config()

const app = express()

app.use('/uploads', express.static(path.resolve('uploads')))

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/incomes', incomeRoutes)
app.use('/expenses', expenseRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/charts', chartRoutes)

app.get('/', (req, res) => {
  res.send('API running...')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})