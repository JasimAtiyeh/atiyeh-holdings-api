import express from "express";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  getTicketsByHouseId,
  getTicketsByTenantId,
  updateTicket,
} from "../repos/tickets";

const TicketRoutes = express.Router();
TicketRoutes.use(express.json());

TicketRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const tickets = await getTickets();
      if (!tickets.length)
        return res.status(404).json({ message: "No tickets found" });
      return res.status(200).json({ tickets });
    } catch (error) {
      return res.status(500).json({ message: "Error getting tickets", error });
    }
  })
  .post(async (req, res) => {
    const { tenantId, houseId, submitDate, title, description } = req.body;
    if (!tenantId || !houseId || !submitDate || !title || !description) {
      return res
        .status(400)
        .json({ message: "All ticket fields are required" });
    }

    try {
      const ticketId = await createTicket(
        tenantId,
        houseId,
        submitDate,
        title,
        description
      );
      return res.status(201).json({ ticketId });
    } catch (error) {
      return res.status(500).json({ message: "Ticket not created", error });
    }
  });

TicketRoutes.route("/:ticketId")
  .get(async (req, res) => {
    try {
      const ticket = await getTicketById(Number(req.params.ticketId));
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });
      return res.status(200).json({ ticket });
    } catch (error) {
      return res.status(500).json({ message: "Couldn't get ticket", error });
    }
  })
  .put(async (req, res) => {
    try {
      const success = await updateTicket(Number(req.params.ticketId), req.body);
      if (!success)
        return res.status(400).json({ message: "Ticket not updated" });
      return res.status(200).json({ message: "Ticket updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating ticket", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const success = await deleteTicket(Number(req.params.ticketId));
      if (!success)
        return res.status(400).json({ message: "Ticket not deleted" });
      return res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting ticket", error });
    }
  });

TicketRoutes.get("/house/:houseId", async (req, res) => {
  try {
    const tickets = await getTicketsByHouseId(Number(req.params.houseId));
    if (!tickets.length)
      return res.status(404).json({ message: "No tickets found" });
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get tickets", error });
  }
});

TicketRoutes.get("/tenant/:tenantId", async (req, res) => {
  try {
    const tickets = await getTicketsByTenantId(Number(req.params.tenantId));
    if (!tickets.length)
      return res.status(404).json({ message: "No tickets found" });
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get tickets", error });
  }
});

export default TicketRoutes;
