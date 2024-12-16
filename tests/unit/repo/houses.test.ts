import { setupTestDB, teardownTestDB } from "../../setup/test-db-setup";
import {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  getHousesForOwner,
  getHouseForTenant,
} from "../../../src/repos/houses";
import { createUser } from "../../../src/repos/users";
import { createUniqueEmail } from "../../utilities";

describe("House Repo", () => {
  let createdHouseId: number;
  let ownerId: number;
  let tenantId: number;

  beforeAll(async () => {
    await setupTestDB();
    // Create or fetch an owner user
    const owner = await createUser({
      name: "Owner User",
      email: createUniqueEmail("owner"),
      password: "ownerpassword",
      role: "owner",
    });
    ownerId = owner!.id;

    // Create or fetch a tenant user
    const tenant = await createUser({
      name: "Tenant User",
      email: createUniqueEmail("tenant"),
      password: "tenantpassword",
      role: "tenant",
    });
    tenantId = tenant!.id;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should create a new house with details and owner", async () => {
    const house = await createHouse(
      "123 Maple Ave",
      "Maple Cottage",
      [ownerId],
      {
        bedrooms: 2,
        bathrooms: 1,
        currentValue: 200000,
        purchasePrice: 180000,
        sqft: 1000,
      },
      tenantId
    );

    expect(house).toBeDefined();
    expect(house?.id).toBeGreaterThan(0);
    expect(house?.name).toBe("Maple Cottage");
    createdHouseId = house!.id!;
  });

  it("should get a house by ID", async () => {
    const house = await getHouseById(createdHouseId);
    expect(house).toBeDefined();
    expect(house?.id).toBe(createdHouseId);
    expect(house?.name).toBe("Maple Cottage");
  });

  it("should get all houses", async () => {
    const houses = await getHouses();
    expect(Array.isArray(houses)).toBe(true);
    expect(houses.length).toBeGreaterThanOrEqual(1);
    const found = houses.find((h) => h.id === createdHouseId);
    expect(found).toBeDefined();
  });

  it("should update house details", async () => {
    const success = await updateHouse(
      createdHouseId,
      { name: "Maple Cottage Updated" },
      { sqft: 1100 }
    );
    expect(success).toBe(true);

    const updatedHouse = await getHouseById(createdHouseId);
    expect(updatedHouse).toBeDefined();
    expect(updatedHouse?.name).toBe("Maple Cottage Updated");
  });

  it("should get houses for an owner", async () => {
    const housesForOwner = await getHousesForOwner(ownerId);
    expect(Array.isArray(housesForOwner)).toBe(true);
    expect(housesForOwner.length).toBeGreaterThanOrEqual(1);
    const found = housesForOwner.find((h) => h.id === createdHouseId);
    expect(found).toBeDefined();
  });

  it("should get house for a tenant", async () => {
    const tenantHouse = await getHouseForTenant(tenantId);
    expect(tenantHouse).toBeDefined();
    expect(tenantHouse?.id).toBe(createdHouseId);
  });

  it("should delete a house", async () => {
    const success = await deleteHouse(createdHouseId);
    expect(success).toBe(true);

    const deletedHouse = await getHouseById(createdHouseId);
    expect(deletedHouse).toBeNull();
  });
});
