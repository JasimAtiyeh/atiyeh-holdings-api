import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("User", (table) => {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.string("email", 255).notNullable().unique();
    table.enu("role", ["admin", "owner", "tenant"]).notNullable();
    table.string("password", 255).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("User");
}
