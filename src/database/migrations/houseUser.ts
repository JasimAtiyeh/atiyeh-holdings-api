import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("HouseUser", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("User.id")
      .onDelete("CASCADE");
    table
      .integer("houseId")
      .unsigned()
      .notNullable()
      .references("House.id")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("HouseUser");
}
