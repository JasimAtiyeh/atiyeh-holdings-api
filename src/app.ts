import express from "express";
import AuthRoutes from "./routes/auth";
import UserRoutes from "./routes/users";
import HouseRoutes from "./routes/houses";
import LeaseRoutes from "./routes/leases";
import TicketRoutes from "./routes/tickets";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/houses", HouseRoutes);
app.use("/leases", LeaseRoutes);
app.use("/tickets", TicketRoutes);

app.get("/", (_req, res) => res.send({ status: 200, message: "success!" }));

export default app;
