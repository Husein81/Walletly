// Global imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Local imports
import { authRouter } from "./routes/index.js";
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

// prisma connection
await prisma.$connect();

// listen to the server
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
