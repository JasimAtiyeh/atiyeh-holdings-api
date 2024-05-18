import { ObjectId } from "mongodb";
import { Tspec } from "tspec";

export type UserRole = "admin" | "owner" | "tenant";
export type UserTypes = Admin | Owner | Tentant;

export type User = {
  name: string;
  email: string;
  role: UserRole;
  _id?: ObjectId;
  password?: string;
};

export type Tentant = {
  role: "tenant";
  houseId: ObjectId;
  leaseId: ObjectId;
} & User;

export type Owner = {
  role: "owner";
  houseIds?: Array<ObjectId>;
} & User;

export type Admin = {
  role: "admin";
} & User;

export type UserApiSpec = Tspec.DefineApiSpec<{
  basePath: "/users";
  paths: {
    "/{userId}": {
      get: {
        path: { userId: string };
        responses: { 200: User };
      };
      put: {
        path: { userId: string };
        responses: { 200: string };
      };
    };
  };
}>;

export const usersSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "password", "role"],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      name: { bsonType: "string" },
      email: { bsonType: "string" },
      password: { bsonType: "string" },
      houses: { bsonType: "array" },
      role: { bsonType: "string" },
    },
  },
};
