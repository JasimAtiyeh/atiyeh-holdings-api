import { ObjectId } from "mongodb";

export type Ticket = {
  _id?: ObjectId;
  tenantId: ObjectId;
  houseId: ObjectId;
  submitDate: Date;
  title: string;
  description: string;
  actionItems: {
    read: boolean;
    responded: boolean;
    closed: boolean;
  };
};

export const ticketsSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["tenantId", "houseId", "submitDate", "title", "description"],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      tenantId: { bsonType: "objectId" },
      houseId: { bsonType: "objectId" },
      submitDate: { bsonType: "string" },
      title: { bsonType: "string" },
      description: { bsonType: "string" },
      actionItems: {
        bsonType: "object",
        properties: {
          read: { bsonType: "bool" },
          responded: { bsonType: "bool" },
          closed: { bsonType: "bool" },
        },
      },
    },
  },
};
