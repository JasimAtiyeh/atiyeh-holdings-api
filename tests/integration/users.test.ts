import request from "supertest";
import { setupTestDB, teardownTestDB } from "../setup/test-db-setup";
import app from "../../src/app";

describe("Users Integration Tests", () => {
  let createdUserId: number;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should get all users (initially empty)", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No users found");
  });

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        name: "Integration User",
        email: "integrationuser@example.com",
        password: "secret",
        role: "tenant",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdUserId = res.body.id;
  });

  it("should get all users (now has one)", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const user = res.body.find((u: any) => u.id === createdUserId);
    expect(user).toBeDefined();
    expect(user.email).toBe("integrationuser@example.com");
  });

  it("should get a user by ID", async () => {
    const res = await request(app).get(`/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
    expect(res.body.name).toBe("Integration User");
  });

  it("should update a user", async () => {
    const res = await request(app)
      .put(`/users/${createdUserId}`)
      .send({ name: "Updated Integration User" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully");

    const getRes = await request(app).get(`/users/${createdUserId}`);
    expect(getRes.body.name).toBe("Updated Integration User");
  });

  it("should delete the user", async () => {
    const res = await request(app).delete(`/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");

    const getRes = await request(app).get(`/users/${createdUserId}`);
    expect(getRes.status).toBe(404);
  });
});
