import { ObjectId, OptionalId, Document as Doc } from "mongodb";
import House, { Lease } from "./houses";
import { Tspec } from "tspec";

export type UserRole = "admin" | "owner" | "tenant";
export type UserTypes = Admin | Owner | Tentant;

export type User = {
  name: string;
  email: string;
  role: UserRole;
  _id?: OptionalId<ObjectId>;
  password?: string;
};

export type Tentant = {
  role: "tenant";
  house: House;
  lease: Lease;
} & User;

export type Owner = {
  role: "owner";
  houses?: Array<House>;
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
