export type TicketStatus = "read" | "responded" | "closed";

export interface Ticket {
  id?: number;
  tenantId: number;
  houseId: number;
  submitDate: string;
  title: string;
  description: string;
  status: TicketStatus;
}
