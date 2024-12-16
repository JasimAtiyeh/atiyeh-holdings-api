import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("Ticket", (table) => {
    table.increments("id").primary();
    table
      .integer("houseId")
      .unsigned()
      .notNullable()
      .references("House.id")
      .onDelete("CASCADE");
    table
      .integer("tenantId")
      .unsigned()
      .notNullable()
      .references("User.id")
      .onDelete("CASCADE");
    table.date("submitDate").notNullable();
    table.string("title", 255).notNullable();
    table.text("description").notNullable();
    table
      .enu("status", ["read", "responded", "closed"])
      .notNullable()
      .defaultTo("read");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("Ticket");
}
