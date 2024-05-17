import { Collection, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { GetCollection } from ".";
import "dotenv/config";
import House, { HouseDetails, Lease } from "../models/houses";
import { UserTypes } from "../models/users";

let houseCollection: Collection<House>;

export async function ConnectHouseCollection() {
  houseCollection = await GetCollection<House>(
    process.env.HOUSE_COLLECTION as string
  );
}

// Get House By Id
async function GetHouseById(houseId: string): Promise<House | null> {
  const house = await houseCollection.findOne<House>({
    _id: new ObjectId(houseId),
  });
  if (!house) return null;
  return house;
}

// Get Houses For Owner
async function GetHousesForOwner(userId: string): Promise<House[] | null> {
  const houses = await houseCollection
    .find<House>({
      users: { _id: userId },
    })
    .toArray();
  if (!houses) return null;
  return houses;
}

// Get House For Tenant
async function GetHouseForTenant(userId: string): Promise<House | null> {
  const house = await houseCollection.findOne<House>({
    lease: { tenantId: userId },
  });
  if (!house) return null;
  return house;
}

// Get Houses
async function GetHouses(): Promise<House[] | null> {
  const houses = await houseCollection.find<House>({}).toArray();
  if (!houses.length) return null;
  return houses;
}

// Create House
async function CreateHouse(
  address: string,
  name: string,
  ownerIds: Array<ObjectId>,
  details?: HouseDetails,
  lease?: Lease
): Promise<InsertOneResult<House>> {
  const houseCreated = await houseCollection.insertOne({
    address,
    name,
    ownerIds,
    details,
    lease,
  });
  return houseCreated;
}

// Update House
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

// Delete House
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
