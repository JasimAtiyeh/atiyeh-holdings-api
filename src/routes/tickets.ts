import express from "express";
import {
  CreateTicket,
  DeleteTicket,
  GetTicketById,
  GetTickets,
  GetTicketsByHouseId,
  GetTicketsByTenantId,
  UpdateTicket,
} from "../repos/tickets";

const TicketRoutes = express.Router();
TicketRoutes.use(express.json());

TicketRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const tickets = GetTickets();
      if (!tickets)
        return res.sendStatus(404).json({ message: "No tickets found" });
      return res.sendStatus(200).json({ tickets });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error getting tickets", error });
    }
  })
  .post(async (req, res) => {
    const { tenantId, houseId, submitDate, title, description } = req.body;

    if (!tenantId || !houseId || !submitDate || !title || !description)
      return res.sendStatus(400).json({
        message:
          "Tenant id, house id, submit date, title, and description are required",
      });

    try {
      const existingTicket = await GetTicketsByHouseId(houseId);
      if (existingTicket) {
        return res.status(400).json({ error: "Ticket already exists" });
      }

      const ticket = await CreateTicket(
        tenantId,
        houseId,
        submitDate,
        title,
        description
      );
      if (!ticket.acknowledged)
        return res.status(500).json({ message: "Error creating ticket" });
      return res.status(201).json({ ticketId: ticket.insertedId.toString() });
    } catch (error) {
      return res.status(500).json({ message: "Ticket not created", error });
    }
  });

TicketRoutes.route("/:ticketId")
  .get(async (req, res) => {
    try {
      const ticket = await GetTicketById(req.params.ticketId);
      if (!ticket)
        return res.sendStatus(404).json({ message: "Ticket not found" });
      return res.sendStatus(200).json({ ticket });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Couldn't get ticket", error });
    }
  })
  .put(async (req, res) => {
    try {
      const ticketUpdated = await UpdateTicket(
        req.params.ticketId,
        req.body.updateData
      );
      if (!ticketUpdated)
        return res.sendStatus(400).json({ message: "Ticket not updated" });
      return res
        .sendStatus(200)
        .json({ message: "Ticket updated successfully" });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error updating ticket", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const ticketDeleted = await DeleteTicket(req.params.ticketId);
      if (!ticketDeleted)
        return res.sendStatus(400).json({ message: "Ticket not deleted" });
      return res
        .sendStatus(200)
        .json({ message: "Ticket deleted successfully" });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error deleting ticket", error });
    }
  });

TicketRoutes.get("/:houseId", async (req, res) => {
  try {
    const ticket = await GetTicketsByHouseId(req.params.houseId);
    if (!ticket)
      return res.sendStatus(404).json({ message: "Tickets not found" });
    return res.sendStatus(200).json({ ticket });
  } catch (error) {
    return res.sendStatus(500).json({ message: "Couldn't get ticket", error });
  }
});

TicketRoutes.get("/:tenantId", async (req, res) => {
  try {
    const ticket = await GetTicketsByTenantId(req.params.tenantId);
    if (!ticket)
      return res.sendStatus(404).json({ message: "Tickets not found" });
    return res.sendStatus(200).json({ ticket });
  } catch (error) {
    return res.sendStatus(500).json({ message: "Couldn't get ticket", error });
  }
});

export default TicketRoutes;
