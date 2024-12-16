import knexDb from "../database";
import { User } from "../models/user";

export async function getUserById(userId: number): Promise<User | null> {
  const user = await knexDb<User>("User").where("id", userId).first();
  console.log(userId);
  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await knexDb<User>("User").where("email", email).first();
  return user || null;
}

export async function getUsers(): Promise<User[]> {
  return await knexDb<User>("User").select("*");
}

export async function createUser(user: Partial<User>): Promise<User | null> {
  const [userId] = await knexDb<User>("User").insert(user).returning("id");
  return getUserById(Number(userId.id));
}

export async function updateUser(
  id: number,
  updates: Partial<User>
): Promise<boolean> {
  const rows = await knexDb<User>("User").where("id", id).update(updates);
  return rows > 0;
}

export async function deleteUser(id: number): Promise<boolean> {
  const rows = await knexDb<User>("User").where("id", id).delete();
  return rows > 0;
}
