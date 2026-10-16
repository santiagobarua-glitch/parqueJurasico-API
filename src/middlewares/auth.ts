import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedUser {
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Authentication is not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded === "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      res.status(401).json({ message: "Invalid authentication token" });
      return;
    }

    req.user = { email: decoded.email, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid authentication token" });
  }
}

export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  };
}
