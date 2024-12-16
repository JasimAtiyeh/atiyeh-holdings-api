import { setupTestDB, teardownTestDB } from "../../setup/test-db-setup";
import {
  getLeases,
  getLeaseById,
  getLeaseByHouseId,
  getLeaseByTenantId,
  createLease,
  updateLease,
  deleteLease,
} from "../../../src/repos/leases";
import { createUser } from "../../../src/repos/users";
import { createHouse } from "../../../src/repos/houses";
import { createUniqueEmail } from "../../utilities";

describe("Lease Repo", () => {
  let tenantId: number;
  let ownerId: number;
  let houseId: number;
  let createdLeaseId: number;

  beforeAll(async () => {
    await setupTestDB();

    // Create an owner
    const owner = await createUser({
      name: "Owner User",
      email: createUniqueEmail("owner"),
      password: "ownerpassword",
      role: "owner",
    });
    ownerId = owner!.id;

    // Create a tenant
    const tenant = await createUser({
      name: "Tenant User",
      email: createUniqueEmail("tenant"),
      password: "tenantpassword",
      role: "tenant",
    });
    tenantId = tenant!.id;

    // Create a house for the lease to reference
    const house = await createHouse(
      "456 Pine St",
      "Pine Cabin",
      [ownerId],
      {
        bedrooms: 3,
        bathrooms: 2,
        currentValue: 300000,
        purchasePrice: 250000,
        sqft: 1500,
      },
      tenantId
    );
    houseId = house!.id!;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should create a new lease", async () => {
    const leaseId = await createLease(
      1200, // deposit
      "2024-12-31", // endDate
      1500, // rentPrice
      "2024-01-01", // startDate
      tenantId, // tenantId
      houseId // houseId
    );
    expect(leaseId).toBeGreaterThan(0);
    createdLeaseId = leaseId;
  });

  it("should get a lease by ID", async () => {
    const lease = await getLeaseById(createdLeaseId);
    expect(lease).toBeDefined();
    expect(lease?.id).toBe(createdLeaseId);
    expect(lease?.tenantId).toBe(tenantId);
    expect(lease?.houseId).toBe(houseId);
    expect(lease?.rentPrice).toBe(1500);
  });

  it("should get all leases", async () => {
    const leases = await getLeases();
    expect(Array.isArray(leases)).toBe(true);
    expect(leases.length).toBeGreaterThanOrEqual(1);
    const found = leases.find((l) => l.id === createdLeaseId);
    expect(found).toBeDefined();
  });

  it("should get a lease by house ID", async () => {
    const lease = await getLeaseByHouseId(houseId);
    expect(lease).toBeDefined();
    expect(lease?.id).toBe(createdLeaseId);
  });

  it("should get a lease by tenant ID", async () => {
    const lease = await getLeaseByTenantId(tenantId);
    expect(lease).toBeDefined();
    expect(lease?.id).toBe(createdLeaseId);
  });

  it("should update a lease", async () => {
    const success = await updateLease(createdLeaseId, { rentPrice: 1600 });
    expect(success).toBe(true);

    const updatedLease = await getLeaseById(createdLeaseId);
    expect(updatedLease).toBeDefined();
    expect(updatedLease?.rentPrice).toBe(1600);
  });

  it("should delete a lease", async () => {
    const success = await deleteLease(createdLeaseId);
    expect(success).toBe(true);

    const deleted = await getLeaseById(createdLeaseId);
    expect(deleted).toBeNull();
  });
});
