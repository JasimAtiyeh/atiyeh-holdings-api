import { Knex, knex } from "knex";
import "dotenv/config";

const knexDb: Knex = knex({
  client: "sqlite3",
  connection: {
    filename: process.env.DB_FILE || __dirname + "/data.sqlite",
  },
  migrations: {
    directory: __dirname + "/migrations",
  },
  seeds: {
    directory: __dirname + "/seeds",
  },
  useNullAsDefault: true,
});

export async function connectDB() {
  await knexDb.migrate.latest();
  await knexDb.seed.run();
}

export default knexDb;
