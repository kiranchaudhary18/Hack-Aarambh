import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function jwtMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const auth = req.headers["authorization"] as string;
  if (!auth) return next();
  const parts = auth.split(" ");
  if (parts.length !== 2) return next();
  const token = parts[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "change_this_secret",
    );
    req.user = payload as any;
  } catch (e) {
    // ignore invalid token
  }
  return next();
}
