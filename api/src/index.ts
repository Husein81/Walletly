// Global imports
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Local imports
import {
  accountRouter,
  authRouter,
  categoryRouter,
  expenseRouter,
} from "./routes/index.js";
import prisma from "./util/prisma.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/category", categoryRouter);
app.use("/api/account", accountRouter);

// prisma connection
await prisma.$connect();

// listen to the server
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
