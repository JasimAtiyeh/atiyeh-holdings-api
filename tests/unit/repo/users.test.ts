import {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
} from "../../../src/repos/users";
import { setupTestDB, teardownTestDB } from "../../setup/test-db-setup";
import { createUniqueEmail } from "../../utilities";

describe("User Repo", () => {
  let createdUserId: number;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  const userEmail = createUniqueEmail("tenant");
  it("should create a new user", async () => {
    const user = await createUser({
      name: "Test User",
      email: userEmail,
      password: "testpassword",
      role: "tenant",
    });

    expect(user).toBeDefined();
    expect(user?.id).toBeGreaterThan(0);
    expect(user?.email).toBe(userEmail);
    createdUserId = user!.id;
  });

  it("should get a user by ID", async () => {
    const user = await getUserById(createdUserId);
    expect(user).toBeDefined();
    expect(user?.id).toBe(createdUserId);
    expect(user?.email).toBe(userEmail);
  });

  it("should get a user by email", async () => {
    const user = await getUserByEmail(userEmail);
    expect(user).toBeDefined();
    expect(user?.id).toBe(createdUserId);
    expect(user?.email).toBe(userEmail);
  });

  it("should get all users", async () => {
    const users = await getUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThanOrEqual(1);
    const found = users.find((u) => u.id === createdUserId);
    expect(found).toBeDefined();
  });

  it("should update a user", async () => {
    const success = await updateUser(createdUserId, { name: "Updated User" });
    expect(success).toBe(true);

    const updatedUser = await getUserById(createdUserId);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe("Updated User");
  });

  it("should delete a user", async () => {
    const success = await deleteUser(createdUserId);
    expect(success).toBe(true);

    const user = await getUserById(createdUserId);
    expect(user).toBeNull();
  });
});
