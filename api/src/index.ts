// Global imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import prisma from "./util/index.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

await prisma.$connect();

app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
