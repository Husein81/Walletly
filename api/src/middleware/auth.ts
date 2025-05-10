import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UnauthenticatedError from "../error/unauthenticated.js";

interface AuthRequest extends Request {
  userId?: string;
}

const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer")) {
    throw new UnauthenticatedError("Unauthorized account");
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid token");
  }
};

export default protect;
