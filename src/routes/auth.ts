import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../repos/users";
import "dotenv/config";

const AuthRoutes = express.Router();
AuthRoutes.use(express.json());

AuthRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    if (!JWT_SECRET || !JWT_EXPIRES_IN) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const accessToken = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.status(200).json({ userId: user.id, accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default AuthRoutes;
