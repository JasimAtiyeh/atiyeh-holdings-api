import { MongoClient, Db, Collection, Document as Doc } from "mongodb";
import "dotenv/config";

const { MONGO_CONNECTION_STRING, MONGO_DB: dbName } = process.env;

let db: Db;

// Create a MongoClient
const client = new MongoClient(MONGO_CONNECTION_STRING as string);

export async function ConnectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    await UsersSchema();
    // await HousesSchema();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

export async function GetCollection<T extends Doc>(
  collectionName: string
): Promise<Collection<T>> {
  return (await client.connect())
    .db(process.env.MONGO_DB as string)
    .collection<T>(collectionName);
}

async function UsersSchema() {
  await db.command({
    collMod: process.env.USER_COLLECTION,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email", "password", "role"],
        additionalProperties: false,
        properties: {
          _id: {},
          name: {
            bsonType: "string",
            description: "'name' is required and is a string",
          },
          email: {
            bsonType: "string",
            description: "'email' is required and is a string",
          },
          password: {
            bsonType: "string",
            description: "'password' is required and is a string",
          },
          houses: {
            bsonType: "array",
            description: "array of houses associated with the user",
          },
          role: {
            bsonType: "string",
            description:
              "'role' is required and is either 'admin', 'owner', or 'tentant",
          },
        },
      },
    },
  });
}

async function HousesSchema() {
  await db.command({
    collMod: process.env.HOUSE_COLLECTION,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "address"],
        additionalProperties: false,
        properties: {
          _id: {},
          name: {
            bsonType: "string",
            description: "'name' is required and is a string",
          },
          address: {
            bsonType: "string",
            description: "'address' is required and is a string",
          },
          ownerIds: {
            bsonType: "array",
            description: "array of user ids associated with the house",
          },
          details: {
            bsonType: "object",
            properties: {
              bathrooms: {
                bsonType: "number",
              },
              bedrooms: {
                bsonType: "number",
              },
              currentValue: {
                bsonType: "number",
              },
              purchasePrice: {
                bsonType: "number",
              },
              sqft: {
                bsonType: "number",
              },
            },
          },
          lease: {
            bsonType: "object",
            properties: {
              deposit: {
                bsonType: "number",
              },
              end: {
                bsonType: "date",
              },
              rentPrice: {
                bsonType: "number",
              },
              start: {
                bsonType: "date",
              },
              tenantId: {
                bsonType: "string",
              },
            },
          },
        },
      },
    },
  });
}
