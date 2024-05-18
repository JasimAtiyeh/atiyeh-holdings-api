import { Collection, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { GetCollection } from ".";
import "dotenv/config";
import { House, HouseDetails } from "../models/houses";

let houseCollection: Collection<House>;

export async function ConnectHouseCollection() {
  houseCollection = await GetCollection<House>(
    process.env.HOUSE_COLLECTION as string
  );
}

// Get house by id
async function GetHouseById(houseId: string): Promise<House | null> {
  const house = await houseCollection.findOne<House>({
    _id: new ObjectId(houseId),
  });
  if (!house) return null;
  return house;
}

// Get houses for owner
async function GetHousesForOwner(ownerId: string): Promise<House[] | null> {
  const houses = await houseCollection
    .find<House>({
      ownerIds: { _id: new ObjectId(ownerId) },
    })
    .toArray();
  if (!houses) return null;
  return houses;
}

// Get house for tenant
async function GetHouseForTenant(tenantId: string): Promise<House | null> {
  const house = await houseCollection.findOne<House>({
    leaseId: { tenantId },
  });
  if (!house) return null;
  return house;
}

// Get houses
async function GetHouses(): Promise<House[] | null> {
  const houses = await houseCollection.find<House>({}).toArray();
  if (!houses.length) return null;
  return houses;
}

// Create house
async function CreateHouse(
  address: string,
  name: string,
  ownerIds: Array<ObjectId>,
  details?: HouseDetails,
  leaseId?: ObjectId
): Promise<InsertOneResult<House>> {
  const houseCreated = await houseCollection.insertOne({
    address,
    name,
    ownerIds,
    details,
    leaseId,
  });
  return houseCreated;
}

// Update house
async function UpdateHouse(
  houseId: string,
  updateData: Partial<House>
): Promise<boolean> {
  const houseUpdated = await houseCollection.updateOne(
    { _id: new ObjectId(houseId) },
    { $set: updateData }
  );
  const { acknowledged, modifiedCount } = houseUpdated;
  if (!acknowledged && modifiedCount === 0) return false;
  return true;
}

// Delete house
async function DeleteHouse(houseId: string): Promise<boolean> {
  const houseDeleted = await houseCollection.deleteOne({
    _id: new ObjectId(houseId),
  });
  return houseDeleted.acknowledged;
}

export {
  GetHouseById,
  GetHousesForOwner,
  GetHouseForTenant,
  GetHouses,
  CreateHouse,
  UpdateHouse,
  DeleteHouse,
};
