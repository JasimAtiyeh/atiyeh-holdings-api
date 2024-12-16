import knexDb from "@db/index";
import { Lease } from "../models/lease";

export async function getLeases(): Promise<Lease[]> {
  const leases = await knexDb("Lease").select("*");
  return leases as Lease[];
}

export async function getLeaseById(leaseId: number): Promise<Lease | null> {
  const lease = await knexDb("Lease").where("id", leaseId).first();
  return lease || null;
}

export async function getLeaseByHouseId(
  houseId: number
): Promise<Lease | null> {
  const lease = await knexDb("Lease").where("houseId", houseId).first();
  return lease || null;
}

export async function getLeaseByTenantId(
  tenantId: number
): Promise<Lease | null> {
  const lease = await knexDb("Lease").where("tenantId", tenantId).first();
  return lease || null;
}

export async function createLease(
  deposit: number,
  endDate: string,
  rentPrice: number,
  startDate: string,
  tenantId: number,
  houseId: number
): Promise<number> {
  const [newLeaseId] = await knexDb("Lease").insert({
    deposit,
    endDate,
    rentPrice,
    startDate,
    tenantId,
    houseId,
  });

  await knexDb("House").where("id", houseId).update({ leaseId: newLeaseId });
  return newLeaseId;
}

export async function updateLease(
  leaseId: number,
  updateData: Partial<Lease>
): Promise<boolean> {
  const rows = await knexDb("Lease").where("id", leaseId).update(updateData);
  return rows > 0;
}

export async function deleteLease(leaseId: number): Promise<boolean> {
  const rows = await knexDb("Lease").where("id", leaseId).delete();
  return rows > 0;
}
