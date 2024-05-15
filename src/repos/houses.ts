import { Collection, ObjectId } from "mongodb";
import { GetCollection } from ".";
import "dotenv/config";
import House from "../models/houses";

let houseCollection: Collection<House>;

export async function ConnectHouseCollection() {
  houseCollection = await GetCollection<House>(
    process.env.HOUSE_COLLECTION as string
  );
}

async function GetHouse(houseId: ObjectId): Promise<House | null> {
  const house = await houseCollection.findOne<House>({ _id: houseId });
  if (!house) return null;
  return house;
}

// GetHouses
// UpdateHouse
// DeleteHouse
