import knexDb from "../../src/database";

export async function setupTestDB() {
  await knexDb.migrate.rollback({}, true);
  await knexDb.migrate.forceFreeMigrationsLock();
  await knexDb.migrate.latest();
}

export async function teardownTestDB() {
  await knexDb.destroy();
}
