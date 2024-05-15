import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { GetCollection } from ".";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/users";

let userCollection: Collection<User>;

export async function ConnectUserCollection() {
  console.log(process.env.USER_COLLECTION);
  userCollection = await GetCollection<User>(
    process.env.USER_COLLECTION as string
  );
}

// Get User
async function GetUserById(userId: string): Promise<User | null> {
  const user = await userCollection.findOne<User>({
    _id: new ObjectId(userId),
  });
  if (!user) return null;
  return user;
}

// Get User
async function GetUserByEmail(email: string): Promise<User | null> {
  const user = await userCollection.findOne<User>({ email });
  if (!user) return null;
  return user;
}

// GetUsers
async function GetUsers() {
  const users = await userCollection.find<User>({}).toArray();
  if (!users.length) return null;
  return users;
}

// Create User
async function CreateUser(
  name: string,
  email: string,
  password: string
): Promise<InsertOneResult<User>> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCreated = await userCollection.insertOne({
    name,
    email,
    password: hashedPassword,
  });
  return userCreated;
}

// UpdateUser
async function UpdateUser(userId: string, updateData: Partial<User>) {
  const userUpdated = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updateData }
  );
  const { acknowledged, modifiedCount } = userUpdated;
  if (!acknowledged && modifiedCount === 0) return false;
  return true;
}

// DeleteUser
async function DeleteUser(userId: string) {
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
