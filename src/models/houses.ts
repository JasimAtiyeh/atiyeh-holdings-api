import { ObjectId, OptionalId } from "mongodb";

export type HouseDetails = {
  bathrooms: number;
  bedrooms: number;
  currentValue: number;
  purchasePrice: number;
  sqft: number;
};

export type House = {
  address: string;
  name: string;
  ownerIds: Array<ObjectId>;
  details?: HouseDetails;
  _id?: OptionalId<ObjectId>;
  leaseId?: ObjectId;
  tenantId?: ObjectId;
  maintenanceTicketIds?: Array<ObjectId>;
};

export const housesSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "address", "ownerIds"],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      name: { bsonType: "string" },
      address: { bsonType: "string" },
      ownerIds: { bsonType: "array" },
      leaseId: { bsonType: "objectId" },
      details: {
        bsonType: "object",
        properties: {
          bathrooms: { bsonType: "number" },
          bedrooms: { bsonType: "number" },
          currentValue: { bsonType: "number" },
          purchasePrice: { bsonType: "number" },
          sqft: { bsonType: "number" },
        },
      },
    },
  },
};
