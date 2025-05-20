import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (res: Response, id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 3 days
  });

  return token;
};

export default generateToken;
