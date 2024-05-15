import express, { Response } from "express";
import AuthRoutes from "./routes/auth";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "http";
import { VerifyOptions } from "../node_modules/@types/jsonwebtoken/index.d";
import { ConnectDB } from "./repos";
import "dotenv/config";
import { ConnectUserCollection } from "./repos/users";
import User from "./models/users";
import { Request } from "./types/global";
import UserRoutes from "./routes/users";
import { initTspecServer, Tspec, TspecDocsMiddleware } from "tspec";

async function initServer() {
  const app = express();
  app.use(express.json());
  app.use("/docs", await TspecDocsMiddleware());

  //Routes
  app.get("/", (_req, res) =>
    res.send({ status: STATUS_CODES[200], message: "success!" })
  );
  app.use("/auth", AuthRoutes);
  app.use("/users", UserRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    await ConnectDB();
    await ConnectUserCollection();
    console.log(`Server is running on port ${PORT}`);
  });
}

initServer();

// Middleware to verify JWT token
// const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: any
// ): Response | void => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(
//     token,
//     process.env.JWT_SECRET as jwt.Secret,
//     ((err: any, user: User): Response | void => {
//       if (err) return res.sendStatus(403);
//       req.user = user;
//       next();
//     }) as VerifyOptions
//   );
// };

// app.use(authenticateToken);
