import { ObjectId, OptionalId, Document as Doc } from "mongodb";
import User from "./users";

type HouseDetails = {
  bathrooms: number;
  bedrooms: number;
  currentValue: number;
  purchasePrice: number;
  sqft: number;
};

type Lease = {
  deposit: number;
  end: Date;
  rentPrice: number;
  start: Date;
  tenant: any;
};

export default class House implements Doc {
  constructor(
    public address: string,
    public name: string,
    // TODO - Extend from the user class for tenant type
    public users: Array<User>,
    public details?: HouseDetails,
    public id?: OptionalId<ObjectId>,
    public lease?: Lease
  ) {}
}
