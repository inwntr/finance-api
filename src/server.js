import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chartRoutes from "./routes/chartRoutes.js";
import { reportRoutes } from "./routes/reportRouter.js";
import budgetRouter from "./routes/budgetRouter.js"
import insightRoutes from './routes/insightRoutes.js'
import statusRoutes from './routes/statusRoutes.js'

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://haonfinance.netlify.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/charts", chartRoutes);
app.use('/api/v1/reports', reportRoutes)
app.use('/api/v1/', budgetRouter)
app.use('/api/v1/insights', insightRoutes)
app.use('/api/v1/status', statusRoutes)

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

export default app;
