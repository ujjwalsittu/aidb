import jwt, { Secret } from "jsonwebtoken";
import { env } from "./env";

const jwtSecret = env.JWT_SECRET as Secret;

export function signJWT(payload: object, expiresIn: string = "12h") {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

export function verifyJWT<T>(token: string): T | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch {
    return null;
  }
}
