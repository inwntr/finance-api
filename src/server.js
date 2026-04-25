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
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

dotenv.config()

const app = express()

app.use("/uploads", express.static(uploadsDir));

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://haonfinance.netlify.app'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
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

/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})*/

export default app;
