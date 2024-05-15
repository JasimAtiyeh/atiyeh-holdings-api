import { ObjectId, OptionalId, Document as Doc } from "mongodb";
import House from "./houses";
import { Tspec } from "tspec";

export default class User implements Doc {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public _id?: OptionalId<ObjectId>,
    public houses?: Array<House>
  ) {}
}

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
