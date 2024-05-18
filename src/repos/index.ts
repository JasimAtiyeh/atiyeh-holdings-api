import { MongoClient, Db, Collection, Document as Doc } from "mongodb";
import "dotenv/config";
import { ConnectUserCollection } from "./users";
import { ConnectHouseCollection } from "./houses";
import { ConnectLeaseCollection } from "./leases";
import { ConnectTicketCollection } from "./tickets";
import { usersSchemaValidator } from "../models/users";
import { housesSchemaValidator } from "../models/houses";
import { leasesSchemaValidator } from "../models/leases";
import { ticketsSchemaValidator } from "../models/tickets";

const {
  MONGO_CONNECTION_STRING,
  MONGO_DB,
  USER_COLLECTION,
  HOUSE_COLLECTION,
  LEASE_COLLECTION,
  TICKET_COLLECTION,
} = process.env;

let db: Db;

// Create a MongoClient
const client = new MongoClient(MONGO_CONNECTION_STRING as string);

export async function ConnectDB() {
  try {
    await client.connect();
    db = client.db(MONGO_DB, { promoteValues: true });
    await ConnectUserCollection();
    await ConnectHouseCollection();
    await ConnectLeaseCollection();
    await ConnectTicketCollection();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
    await client.close();
  }
}

export async function GetCollection<T extends Doc>(
  collectionName: string
): Promise<Collection<T>> {
  db.createCollection<T>(collectionName, {
    validator: schemaValidators[collectionName],
  });
  return db.collection<T>(collectionName);
}

const schemaValidators = {
  [USER_COLLECTION as string]: usersSchemaValidator,
  [HOUSE_COLLECTION as string]: housesSchemaValidator,
  [LEASE_COLLECTION as string]: leasesSchemaValidator,
  [TICKET_COLLECTION as string]: ticketsSchemaValidator,
};
