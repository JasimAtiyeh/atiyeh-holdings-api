import knexDb from "../database";
import { House, HouseDetails } from "../models/house";

export async function getHouses(): Promise<House[]> {
  return knexDb<House>("House").select("*");
}

export async function getHouseById(houseId: number): Promise<House | null> {
  const house = await knexDb<House>("House").where("id", houseId).first();
  return house || null;
}

export async function createHouse(
  address: string,
  name: string,
  ownerIds: number[],
  details: Partial<HouseDetails> | null,
  tenantId?: number | null
): Promise<House | null> {
  return await knexDb.transaction(async (trx) => {
    const houseIds = await trx<House>("House").insert({
      address,
      name,
      tenantId,
    });
    const insertedHouseId = houseIds[0];

    if (details) {
      const detailsIds = await trx<HouseDetails>("HouseDetails").insert({
        houseId: insertedHouseId,
        bathrooms: details.bathrooms as number,
        bedrooms: details.bedrooms as number,
        currentValue: details.currentValue as number,
        purchasePrice: details.purchasePrice as number,
        sqft: details.sqft as number,
      });
      const insertedDetailsId = detailsIds[0];

      await trx<House>("House")
        .where("id", insertedHouseId)
        .update({ detailsId: insertedDetailsId });
    }

    const ownerRelations = ownerIds.map((ownerId) => ({
      houseId: insertedHouseId,
      userId: ownerId,
    }));
    await trx("HouseUser").insert(ownerRelations);

    const newHouse = await trx<House>("House")
      .where("id", insertedHouseId)
      .first();
    return newHouse || null;
  });
}

export async function updateHouse(
  id: number,
  updateData: Partial<House>,
  updateDetails?: Partial<HouseDetails>
): Promise<boolean> {
  return await knexDb.transaction(async (trx) => {
    let updated = false;

    if (Object.keys(updateData).length > 0) {
      const houseUpdateCount = await trx<House>("House")
        .where("id", id)
        .update(updateData);
      if (houseUpdateCount > 0) updated = true;
    }

    if (updateDetails && Object.keys(updateDetails).length > 0) {
      const detailsUpdateCount = await trx<HouseDetails>("HouseDetails")
        .where("houseId", id)
        .update(updateDetails);
      if (detailsUpdateCount > 0) updated = true;
    }

    return updated;
  });
}

export async function deleteHouse(id: number): Promise<boolean> {
  const rows = await knexDb("House").where("id", id).delete();
  return rows > 0;
}

export async function getHousesForOwner(userId: number): Promise<House[]> {
  return knexDb("House")
    .join("HouseUser", "House.id", "HouseUser.houseId")
    .where("HouseUser.userId", userId)
    .select("House.*");
}

export async function getHouseForTenant(
  tenantId: number
): Promise<House | null> {
  const house = await knexDb<House>("House")
    .where("tenantId", tenantId)
    .first();
  return house || null;
}
