import jwt from "jsonwebtoken";
import config from "../config/config";

const JWT_SECRET = config.jwtSecret;

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};
