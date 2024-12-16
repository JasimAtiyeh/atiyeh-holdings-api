import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("HouseDetails", (table) => {
    table.increments("id").primary();
    table
      .integer("houseId")
      .unsigned()
      .notNullable()
      .references("House.id")
      .onDelete("CASCADE");
    table.integer("bedrooms").notNullable();
    table.integer("bathrooms").notNullable();
    table.decimal("currentValue", 15, 2).notNullable();
    table.decimal("purchasePrice", 15, 2).notNullable();
    table.integer("sqft").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("HouseDetails");
}
