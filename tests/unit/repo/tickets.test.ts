import { setupTestDB, teardownTestDB } from "../../setup/test-db-setup";
import {
  getTickets,
  getTicketById,
  getTicketsByHouseId,
  getTicketsByTenantId,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../../src/repos/tickets";
import { createUser } from "../../../src/repos/users";
import { createHouse } from "../../../src/repos/houses";
import { createUniqueEmail } from "../../utilities";

describe("Ticket Repo", () => {
  let tenantId: number;
  let ownerId: number;
  let houseId: number;
  let createdTicketId: number;

  beforeAll(async () => {
    await setupTestDB();

    // Create owner
    const owner = await createUser({
      name: "Owner User",
      email: createUniqueEmail("owner"),
      password: "ownerpassword",
      role: "owner",
    });
    ownerId = owner!.id;

    // Create tenant
    const tenant = await createUser({
      name: "Tenant User",
      email: createUniqueEmail("tenant"),
      password: "tenantpassword",
      role: "tenant",
    });
    tenantId = tenant!.id;

    // Create a house
    const house = await createHouse(
      "789 Cherry St",
      "Cherry Loft",
      [ownerId],
      {
        bedrooms: 2,
        bathrooms: 2,
        currentValue: 220000,
        purchasePrice: 200000,
        sqft: 1100,
      },
      tenantId
    );
    houseId = house!.id!;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should create a ticket", async () => {
    const ticketId = await createTicket(
      tenantId,
      houseId,
      "2024-03-01",
      "Broken Window",
      "The window in the bedroom is broken and won't close."
    );
    expect(ticketId).toBeGreaterThan(0);
    createdTicketId = ticketId;
  });

  it("should get a ticket by ID", async () => {
    const ticket = await getTicketById(createdTicketId);
    expect(ticket).toBeDefined();
    expect(ticket?.id).toBe(createdTicketId);
    expect(ticket?.title).toBe("Broken Window");
    expect(ticket?.description).toBe(
      "The window in the bedroom is broken and won't close."
    );
    expect(ticket?.tenantId).toBe(tenantId);
    expect(ticket?.houseId).toBe(houseId);
  });

  it("should get all tickets", async () => {
    const tickets = await getTickets();
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThanOrEqual(1);
    const found = tickets.find((t) => t.id === createdTicketId);
    expect(found).toBeDefined();
  });

  it("should get tickets by house ID", async () => {
    const houseTickets = await getTicketsByHouseId(houseId);
    expect(Array.isArray(houseTickets)).toBe(true);
    expect(houseTickets.length).toBeGreaterThanOrEqual(1);
    expect(houseTickets[0].houseId).toBe(houseId);
  });

  it("should get tickets by tenant ID", async () => {
    const tenantTickets = await getTicketsByTenantId(tenantId);
    expect(Array.isArray(tenantTickets)).toBe(true);
    expect(tenantTickets.length).toBeGreaterThanOrEqual(1);
    expect(tenantTickets[0].tenantId).toBe(tenantId);
  });

  it("should update a ticket", async () => {
    const success = await updateTicket(createdTicketId, {
      status: "responded",
    });
    expect(success).toBe(true);

    const updatedTicket = await getTicketById(createdTicketId);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket?.status).toBe("responded");
  });

  it("should delete a ticket", async () => {
    const success = await deleteTicket(createdTicketId);
    expect(success).toBe(true);

    const deleted = await getTicketById(createdTicketId);
    expect(deleted).toBeNull();
  });
});
