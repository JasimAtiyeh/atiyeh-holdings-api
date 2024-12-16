export interface Lease {
  id?: number;
  deposit: number;
  endDate: string;
  rentPrice: number;
  startDate: string;
  tenantId: number;
  houseId: number;
}
