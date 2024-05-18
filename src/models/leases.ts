import { ObjectId } from "mongodb";

export type Lease = {
  _id?: ObjectId;
  deposit: number;
  endDate: Date;
  rentPrice: number;
  startDate: Date;
  tenantId: ObjectId;
  houseId: ObjectId;
};

export const leasesSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "deposit",
      "endDate",
      "rentPrice",
      "startDate",
      "houseId",
      "tenantId",
    ],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      deposit: { bsonType: "number" },
      endDate: { bsonType: "date" },
      rentPrice: { bsonType: "number" },
      startDate: { bsonType: "date" },
      houseId: { bsonType: "objectId" },
      tenantId: { bsonType: "objectId" },
    },
  },
};
