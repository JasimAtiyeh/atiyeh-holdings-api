export interface HouseDetails {
  id?: number;
  houseId: number;
  bathrooms: number;
  bedrooms: number;
  currentValue: number;
  purchasePrice: number;
  sqft: number;
}

export interface House {
  id?: number;
  address: string;
  name: string;
  detailsId?: number | null;
  leaseId?: number | null;
  tenantId?: number | null;
}
