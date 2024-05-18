import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { Lease } from "../models/leases";
import { GetCollection } from ".";

let leaseCollection: Collection<Lease>;

export async function ConnectLeaseCollection() {
  leaseCollection = await GetCollection<Lease>(
    process.env.LEASE_COLLECTION as string
  );
}

// Get leases
async function GetLeases(): Promise<Lease[] | null> {
  const leases = await leaseCollection.find<Lease>({}).toArray();
  if (!leases) return null;
  return leases;
}

// Get lease by id
async function GetLeaseById(leaseId: string): Promise<Lease | null> {
  const lease = await leaseCollection.findOne<Lease>({
    _id: new ObjectId(leaseId),
  });
  if (!lease) return null;
  return lease;
}

// Get lease by house id
async function GetLeaseByHouseId(houseId: string): Promise<Lease | null> {
  const lease = await leaseCollection.findOne<Lease>({
    houseId: new ObjectId(houseId),
  });
  if (!lease) return null;
  return lease;
}

// Get lease by tenant id
async function GetLeaseByTenantId(tenantId: string): Promise<Lease | null> {
  const lease = await leaseCollection.findOne<Lease>({
    tenantId: new ObjectId(tenantId),
  });
  if (!lease) return null;
  return lease;
}

// Create lease
async function CreateLease(
  deposit: string,
  endDate: string,
  rentPrice: string,
  startDate: string,
  tenantId: string,
  houseId: string
): Promise<InsertOneResult<Lease>> {
  const userCreated = await leaseCollection.insertOne({
    deposit: parseInt(deposit),
    endDate: new Date(endDate),
    rentPrice: parseInt(rentPrice),
    startDate: new Date(startDate),
    tenantId: new ObjectId(tenantId),
    houseId: new ObjectId(houseId),
  } as Lease);
  return userCreated;
}

// Update lease
async function UpdateLease(
  leaseId: string,
  updateData: Lease
): Promise<boolean> {
  const leaseUpdated = await leaseCollection.updateOne(
    { _id: new ObjectId(leaseId) },
    { $set: updateData }
  );
  const { acknowledged, modifiedCount } = leaseUpdated;
  if (!acknowledged && modifiedCount === 0) return false;
  return true;
}

// Delete lease
async function DeleteLease(leaseId: string): Promise<boolean> {
  const leaseDeleted = await leaseCollection.deleteOne({
    _id: new ObjectId(leaseId),
  });
  return leaseDeleted.acknowledged;
}

export {
  GetLeases,
  GetLeaseById,
  GetLeaseByHouseId,
  GetLeaseByTenantId,
  CreateLease,
  UpdateLease,
  DeleteLease,
};
