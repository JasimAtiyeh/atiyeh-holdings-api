import request from "supertest";
import { setupTestDB, teardownTestDB } from "../setup/test-db-setup";
import app from "../../src/app";

describe("Houses Integration Tests", () => {
  let ownerId: number;
  let houseId: number;

  beforeAll(async () => {
    await setupTestDB();
    // Create an owner user for linking to a house
    const userRes = await request(app)
      .post("/users")
      .send({
        name: "Owner User",
        email: "owner@example.com",
        password: "ownerpass",
        role: "owner",
      })
      .set("Content-Type", "application/json");
    ownerId = userRes.body.id;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should return no houses initially", async () => {
    const res = await request(app).get("/houses");
    expect(res.status).toBe(404);
  });

  it("should create a new house", async () => {
    const res = await request(app)
      .post("/houses")
      .send({
        address: "123 Main St",
        name: "Test House",
        ownerIds: [ownerId],
        details: {
          bedrooms: 3,
          bathrooms: 2,
          currentValue: 300000,
          purchasePrice: 250000,
          sqft: 1500,
        },
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.houseId).toBeDefined();
    houseId = res.body.houseId;
  });

  it("should get all houses", async () => {
    const res = await request(app).get("/houses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.houses)).toBe(true);
    const house = res.body.houses.find((h: any) => h.id === houseId);
    expect(house).toBeDefined();
  });

  it("should get house by ID", async () => {
    const res = await request(app).get(`/houses/${houseId}`);
    expect(res.status).toBe(200);
    expect(res.body.house.id).toBe(houseId);
  });

  it("should update a house", async () => {
    const res = await request(app)
      .put(`/houses/${houseId}`)
      .send({
        updateData: { name: "Updated House Name" },
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/houses/${houseId}`);
    expect(getRes.body.house.name).toBe("Updated House Name");
  });

  it("should get houses for owner", async () => {
    const res = await request(app).get(`/houses/user/${ownerId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.houses)).toBe(true);
    expect(res.body.houses[0].id).toBe(houseId);
  });

  it("should delete a house", async () => {
    const res = await request(app).delete(`/houses/${houseId}`);
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/houses/${houseId}`);
    expect(getRes.status).toBe(404);
  });
});
