import { UserRole } from "../src/models/user";

export function createUniqueEmail(userRole: UserRole): string {
  return `${userRole}_${Date.now()}@example.com`;
}
