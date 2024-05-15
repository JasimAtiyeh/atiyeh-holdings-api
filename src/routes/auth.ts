import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GetUserByEmail } from "../repos/users";
import "dotenv/config";

const AuthRoutes = express.Router();
AuthRoutes.use(express.json());

// Login route
AuthRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await GetUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
      const accessToken = jwt.sign(
        { email: user.email },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.cookie("accessToken", accessToken, {
        maxAge: 900000,
        httpOnly: true,
      });
      return res.status(200).json({ userId: user._id });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
});

// Logout
// Refresh Token

export default AuthRoutes;
