import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("Lease", (table) => {
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
    table.date("startDate").notNullable();
    table.date("endDate").notNullable();
    table.decimal("rentPrice", 10, 2).notNullable();
    table.decimal("deposit", 10, 2).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("Lease");
}
