import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { GetCollection } from ".";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UserRole, UserTypes } from "../models/users";

let userCollection: Collection<UserTypes>;

export async function ConnectUserCollection() {
  userCollection = await GetCollection<UserTypes>(
    process.env.USER_COLLECTION as string
  );
}

// Get User
async function GetUserById(userId: string): Promise<UserTypes | null> {
  const user = await userCollection.findOne<UserTypes>({
    _id: new ObjectId(userId),
  });
  if (!user) return null;
  return user;
}

// Get User
async function GetUserByEmail(email: string): Promise<UserTypes | null> {
  const user = await userCollection.findOne<UserTypes>({ email });
  if (!user) return null;
  return user;
}

// GetUsers
async function GetUsers(): Promise<UserTypes[] | null> {
  const users = await userCollection.find<UserTypes>({}).toArray();
  if (!users.length) return null;
  return users;
}

// Create User
async function CreateUser(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<InsertOneResult<UserTypes>> {
  // Make object dynamic depending on role
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCreated = await userCollection.insertOne({
    name,
    email,
    password: hashedPassword,
    role,
  });
  return userCreated;
}

// UpdateUser
async function UpdateUser(
  userId: string,
  updateData: Partial<UserTypes>
): Promise<boolean> {
  const userUpdated = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updateData }
  );
  const { acknowledged, modifiedCount } = userUpdated;
  if (!acknowledged && modifiedCount === 0) return false;
  return true;
}

// DeleteUser
async function DeleteUser(userId: string): Promise<boolean> {
  const userDeleted = await userCollection.deleteOne({
    _id: new ObjectId(userId),
  });
  return userDeleted.acknowledged;
}

export {
  GetUserById,
  GetUserByEmail,
  CreateUser,
  GetUsers,
  UpdateUser,
  DeleteUser,
};
