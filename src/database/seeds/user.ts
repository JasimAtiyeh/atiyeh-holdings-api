import { Knex } from "knex";
import bcrypt from "bcrypt";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    password: "adminpassword",
  },
  {
    name: "Owner User",
    email: "owner@example.com",
    role: "owner",
    password: "ownerpassword",
  },
  {
    name: "Tenant User",
    email: "tenant@example.com",
    role: "tenant",
    password: "tenantpassword",
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("User").del();

  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  await knex("User").insert(hashedUsers);
}
