import express from "express";
import cors from "cors";

import authRoutes from "../src/routes/authRoutes.js";
import userRoutes from "../src/routes/userRoutes.js";
import incomeRoutes from "../src/routes/incomeRoutes.js";
import expenseRoutes from "../src/routes/expenseRoutes.js";
import dashboardRoutes from "../src/routes/dashboardRoutes.js";
import chartRoutes from "../src/routes/chartRoutes.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://haonfinance.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/incomes", incomeRoutes);
app.use("/expenses", expenseRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/charts", chartRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

export default app;
