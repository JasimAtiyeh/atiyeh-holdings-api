import express from "express";
import AuthRoutes from "./routes/auth";
import { STATUS_CODES } from "http";
import { ConnectDB } from "./repos";
import "dotenv/config";
import { ConnectUserCollection } from "./repos/users";
import UserRoutes from "./routes/users";
import { TspecDocsMiddleware } from "tspec";

async function initServer() {
  const app = express();
  app.use(express.json());
  await ConnectDB();
  await ConnectUserCollection();

  //Routes
  app.use("/docs", await TspecDocsMiddleware());
  app.use("/auth", AuthRoutes);
  app.use("/users", UserRoutes);
  app.get("/", (_req, res) =>
    res.send({ status: STATUS_CODES[200], message: "success!" })
  );

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

initServer();
