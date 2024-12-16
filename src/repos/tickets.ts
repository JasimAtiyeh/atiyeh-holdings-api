import knexDb from "../database";
import { Ticket } from "../models/ticket";

export async function getTickets(): Promise<Ticket[]> {
  const tickets = await knexDb("Ticket").select("*");
  return tickets as Ticket[];
}

export async function getTicketById(ticketId: number): Promise<Ticket | null> {
  const ticket = await knexDb("Ticket").where("id", ticketId).first();
  return ticket || null;
}

export async function getTicketsByHouseId(houseId: number): Promise<Ticket[]> {
  const tickets = await knexDb("Ticket").where("houseId", houseId);
  return tickets as Ticket[];
}

export async function getTicketsByTenantId(
  tenantId: number
): Promise<Ticket[]> {
  const tickets = await knexDb("Ticket").where("tenantId", tenantId);
  return tickets as Ticket[];
}

export async function createTicket(
  tenantId: number,
  houseId: number,
  submitDate: string,
  title: string,
  description: string
): Promise<number> {
  const [newTicketId] = await knexDb("Ticket").insert({
    tenantId,
    houseId,
    submitDate,
    title,
    description,
    status: "read",
  });
  return newTicketId;
}

export async function updateTicket(
  ticketId: number,
  updateData: Partial<Ticket>
): Promise<boolean> {
  const rows = await knexDb("Ticket").where("id", ticketId).update(updateData);
  return rows > 0;
}

export async function deleteTicket(ticketId: number): Promise<boolean> {
  const rows = await knexDb("Ticket").where("id", ticketId).delete();
  return rows > 0;
}
