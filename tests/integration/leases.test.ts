import request from "supertest";
import { setupTestDB, teardownTestDB } from "../setup/test-db-setup";
import app from "../../src/app";

describe("Leases Integration Tests", () => {
  let tenantId: number;
  let ownerId: number;
  let houseId: number;
  let leaseId: number;

  beforeAll(async () => {
    await setupTestDB();

    // Create owner
    const ownerRes = await request(app)
      .post("/users")
      .send({
        name: "Owner User",
        email: "ownerlease@example.com",
        password: "ownerpassword",
        role: "owner",
      })
      .set("Content-Type", "application/json");
    ownerId = ownerRes.body.id;

    // Create tenant
    const tenantRes = await request(app)
      .post("/users")
      .send({
        name: "Tenant User",
        email: "tenantlease@example.com",
        password: "tenantpassword",
        role: "tenant",
      })
      .set("Content-Type", "application/json");
    tenantId = tenantRes.body.id;

    // Create a house
    const houseRes = await request(app)
      .post("/houses")
      .send({
        address: "456 Pine St",
        name: "Pine Cabin",
        ownerIds: [ownerId],
        details: {
          bedrooms: 3,
          bathrooms: 2,
          currentValue: 300000,
          purchasePrice: 250000,
          sqft: 1500,
        },
        tenantId,
      })
      .set("Content-Type", "application/json");
    houseId = houseRes.body.houseId;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should return no leases initially", async () => {
    const res = await request(app).get("/leases");
    expect(res.status).toBe(404);
  });

  it("should create a lease", async () => {
    const res = await request(app)
      .post("/leases")
      .send({
        deposit: 1200,
        endDate: "2024-12-31",
        rentPrice: 1500,
        startDate: "2024-01-01",
        tenantId,
        houseId,
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.leaseId).toBeDefined();
    leaseId = parseInt(res.body.leaseId, 10);
  });

  it("should get all leases", async () => {
    const res = await request(app).get("/leases");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leases)).toBe(true);
    expect(res.body.leases.length).toBe(1);
  });

  it("should get a lease by ID", async () => {
    const res = await request(app).get(`/leases/${leaseId}`);
    expect(res.status).toBe(200);
    expect(res.body.lease.id).toBe(leaseId);
  });

  it("should get lease by house ID", async () => {
    const res = await request(app).get(`/leases/house/${houseId}`);
    expect(res.status).toBe(200);
    expect(res.body.lease.id).toBe(leaseId);
  });

  it("should get lease by tenant ID", async () => {
    const res = await request(app).get(`/leases/tenant/${tenantId}`);
    expect(res.status).toBe(200);
    expect(res.body.lease.id).toBe(leaseId);
  });

  it("should update a lease", async () => {
    const res = await request(app)
      .put(`/leases/${leaseId}`)
      .send({ rentPrice: 1600 })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/leases/${leaseId}`);
    expect(getRes.body.lease.rentPrice).toBe(1600);
  });

  it("should delete a lease", async () => {
    const res = await request(app).delete(`/leases/${leaseId}`);
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/leases/${leaseId}`);
    expect(getRes.status).toBe(404);
  });
});
