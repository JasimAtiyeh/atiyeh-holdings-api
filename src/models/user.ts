export type UserRole = "admin" | "owner" | "tenant";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}
