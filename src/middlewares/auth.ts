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
    res.status(401).json({ message: "Token de autenticación requerido" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "La autenticación no está configurada" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded === "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      res.status(401).json({ message: "Token de autenticación inválido" });
      return;
    }

    req.user = { email: decoded.email, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: "Token de autenticación inválido" });
  }
}

export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: "Permisos insuficientes" });
      return;
    }

    next();
  };
}
