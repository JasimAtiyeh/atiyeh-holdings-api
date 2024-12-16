import { Knex } from "knex";

const leases = [
  {
    houseId: 1,
    tenantId: 3,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    rentPrice: 1500,
    deposit: 1000,
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("Lease").del();
  await knex("Lease").insert(leases);

  const lease = await knex("Lease").where("houseId", 1).first();
  if (lease) {
    await knex("House").where("id", 1).update({ leaseId: lease.id });
  }
}
