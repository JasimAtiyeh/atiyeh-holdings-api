import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("House", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("address", 255).notNullable();
    table
      .integer("tenantId")
      .unsigned()
      .nullable()
      .references("User.id")
      .onDelete("SET NULL");
    table
      .integer("leaseId")
      .unsigned()
      .nullable()
      .references("Lease.id")
      .onDelete("SET NULL");
    table
      .integer("detailsId")
      .unsigned()
      .nullable()
      .references("HouseDetails.id")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("House");
}
