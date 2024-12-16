import { Knex } from "knex";

const tickets = [
  {
    houseId: 1,
    tenantId: 3,
    submitDate: "2024-01-15",
    title: "Leaking Kitchen Faucet",
    description: "The kitchen faucet is leaking.",
    status: "read",
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("Ticket").del();
  await knex("Ticket").insert(tickets);
}
