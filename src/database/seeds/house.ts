import { Knex } from "knex";

const houses = [
  { name: "Sunny Villa", address: "123 Main St", tenantId: 3 },
  { name: "Cozy Cottage", address: "456 Elm St", tenantId: null },
];

const houseDetails = [
  {
    houseId: 1,
    bathrooms: 2,
    bedrooms: 3,
    currentValue: 350000,
    purchasePrice: 300000,
    sqft: 1500,
  },
  {
    houseId: 2,
    bathrooms: 1,
    bedrooms: 2,
    currentValue: 200000,
    purchasePrice: 180000,
    sqft: 900,
  },
];

const houseUsers = [{ houseId: 1, userId: 2 }];

export async function seed(knex: Knex): Promise<void> {
  await knex("HouseUser").del();
  await knex("HouseDetails").del();
  await knex("House").del();

  await knex("House").insert(houses);
  await knex("HouseDetails").insert(houseDetails);
  await knex("HouseUser").insert(houseUsers);
}
