import request from "supertest";
import { setupTestDB, teardownTestDB } from "../setup/test-db-setup";
import app from "../../src/app";
import { createUniqueEmail } from "../utilities";

describe("Tickets Integration Tests", () => {
  let tenantId: number;
  let ownerId: number;
  let houseId: number;
  let ticketId: number;

  beforeAll(async () => {
    await setupTestDB();

    // Create owner
    const ownerEmail = createUniqueEmail("owner");
    const ownerRes = await request(app)
      .post("/users")
      .send({
        name: "Owner User",
        email: ownerEmail,
        password: "ownerpassword",
        role: "owner",
      })
      .set("Content-Type", "application/json");
    ownerId = ownerRes.body.id;

    // Create tenant
    const tenantEmail = createUniqueEmail("tenant");
    const tenantRes = await request(app)
      .post("/users")
      .send({
        name: "Tenant User",
        email: tenantEmail,
        password: "tenantpassword",
        role: "tenant",
      })
      .set("Content-Type", "application/json");
    tenantId = tenantRes.body.id;

    // Create a house
    const houseRes = await request(app)
      .post("/houses")
      .send({
        address: "789 Cherry St",
        name: "Cherry Loft",
        ownerIds: [ownerId],
        details: {
          bedrooms: 2,
          bathrooms: 2,
          currentValue: 220000,
          purchasePrice: 200000,
          sqft: 1100,
        },
        tenantId,
      })
      .set("Content-Type", "application/json");
    houseId = houseRes.body.houseId;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should return no tickets initially", async () => {
    const res = await request(app).get("/tickets");
    expect(res.status).toBe(404);
  });

  it("should create a ticket", async () => {
    const res = await request(app)
      .post("/tickets")
      .send({
        tenantId,
        houseId,
        submitDate: "2024-03-01",
        title: "Broken Window",
        description: "The window in the bedroom is broken and won't close.",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.ticketId).toBeDefined();
    ticketId = parseInt(res.body.ticketId, 10);
  });

  it("should get all tickets", async () => {
    const res = await request(app).get("/tickets");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tickets)).toBe(true);
    expect(res.body.tickets.length).toBe(1);
  });

  it("should get a ticket by ID", async () => {
    const res = await request(app).get(`/tickets/${ticketId}`);
    expect(res.status).toBe(200);
    expect(res.body.ticket.id).toBe(ticketId);
  });

  it("should get tickets by house ID", async () => {
    const res = await request(app).get(`/tickets/house/${houseId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tickets)).toBe(true);
    expect(res.body.tickets[0].id).toBe(ticketId);
  });

  it("should get tickets by tenant ID", async () => {
    const res = await request(app).get(`/tickets/tenant/${tenantId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tickets)).toBe(true);
    expect(res.body.tickets[0].id).toBe(ticketId);
  });

  it("should update a ticket", async () => {
    const res = await request(app)
      .put(`/tickets/${ticketId}`)
      .send({ status: "responded" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/tickets/${ticketId}`);
    expect(getRes.body.ticket.status).toBe("responded");
  });

  it("should delete a ticket", async () => {
    const res = await request(app).delete(`/tickets/${ticketId}`);
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/tickets/${ticketId}`);
    expect(getRes.status).toBe(404);
  });
});
