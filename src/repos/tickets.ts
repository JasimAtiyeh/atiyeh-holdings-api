import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { Ticket } from "../models/tickets";
import { GetCollection } from ".";

let ticketCollection: Collection<Ticket>;

export async function ConnectTicketCollection() {
  ticketCollection = await GetCollection<Ticket>(
    process.env.TICKET_COLLECTION as string
  );
}

// Get tickets
async function GetTickets(): Promise<Ticket[] | null> {
  const tickets = await ticketCollection.find<Ticket>({}).toArray();
  if (!tickets) return null;
  return tickets;
}

// Get ticket by id
async function GetTicketById(leaseId: string): Promise<Ticket | null> {
  const ticket = await ticketCollection.findOne<Ticket>({
    _id: new ObjectId(leaseId),
  });
  if (!ticket) return null;
  return ticket;
}

// Get tickets by house id
async function GetTicketsByHouseId(houseId: string): Promise<Ticket[] | null> {
  const tickets = await ticketCollection
    .find<Ticket>({
      houseId: new ObjectId(houseId),
    })
    .toArray();
  if (!tickets) return null;
  return tickets;
}

// Get tickets by tenant id
async function GetTicketsByTenantId(
  tenantId: string
): Promise<Ticket[] | null> {
  const tickets = await ticketCollection
    .find<Ticket>({
      tenantId: new ObjectId(tenantId),
    })
    .toArray();
  if (!tickets) return null;
  return tickets;
}

// Create lease
async function CreateTicket(
  tenantId: string,
  houseId: string,
  submitDate: string,
  title: string,
  description: string
): Promise<InsertOneResult<Ticket>> {
  const userCreated = await ticketCollection.insertOne({
    tenantId: new ObjectId(tenantId),
    houseId: new ObjectId(houseId),
    submitDate: new Date(submitDate),
    title,
    description,
  } as Ticket);
  return userCreated;
}

// Update ticket
async function UpdateTicket(
  ticketId: string,
  updateData: Ticket
): Promise<boolean> {
  const ticketUpdated = await ticketCollection.updateOne(
    { _id: new ObjectId(ticketId) },
    { $set: updateData }
  );
  const { acknowledged, modifiedCount } = ticketUpdated;
  if (!acknowledged && modifiedCount === 0) return false;
  return true;
}

// Delete ticket
async function DeleteTicket(ticketId: string): Promise<boolean> {
  const ticketDeleted = await ticketCollection.deleteOne({
    _id: new ObjectId(ticketId),
  });
  return ticketDeleted.acknowledged;
}

export {
  GetTickets,
  GetTicketById,
  GetTicketsByHouseId,
  GetTicketsByTenantId,
  CreateTicket,
  UpdateTicket,
  DeleteTicket,
};
