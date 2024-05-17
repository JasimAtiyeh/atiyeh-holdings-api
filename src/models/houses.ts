import { ObjectId, OptionalId, Document as Doc } from "mongodb";

export type HouseDetails = {
  bathrooms: number;
  bedrooms: number;
  currentValue: number;
  purchasePrice: number;
  sqft: number;
};

export type Lease = {
  deposit: number;
  end: Date;
  rentPrice: number;
  start: Date;
  tenantId: ObjectId;
};

export default class House implements Doc {
  constructor(
    public address: string,
    public name: string,
    public ownerIds: Array<ObjectId>,
    public details?: HouseDetails,
    public id?: OptionalId<ObjectId>,
    public lease?: Lease
  ) {}
}
