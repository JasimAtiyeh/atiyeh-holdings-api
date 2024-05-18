import express from "express";
import AuthRoutes from "./routes/auth";
import { ConnectDB } from "./repos";
import "dotenv/config";
import UserRoutes from "./routes/users";
import { TspecDocsMiddleware } from "tspec";
import HouseRoutes from "./routes/houses";
import LeaseRoutes from "./routes/leases";
import TicketRoutes from "./routes/tickets";

async function initServer() {
  const app = express().use(express.json());
  await ConnectDB();

  //Routes
  app.use("/docs", await TspecDocsMiddleware());
  app.use("/auth", AuthRoutes);
  app.use("/users", UserRoutes);
  app.use("/houses", HouseRoutes);
  app.use("/leases", LeaseRoutes);
  app.use("/tickets", TicketRoutes);
  app.get("/", (_req, res) => res.send({ status: 200, message: "success!" }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

initServer();
