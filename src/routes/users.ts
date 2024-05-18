import express from "express";
import {
  CreateUser,
  DeleteUser,
  GetUserById,
  GetUserByEmail,
  GetUsers,
  UpdateUser,
} from "../repos/users";

const UserRoutes = express.Router();
UserRoutes.use(express.json());

UserRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const users = await GetUsers();
      if (!users) return res.status(404).json({ message: "No users found" });
      const returnUsers = users.map((user) => delete user.password);
      return res.status(200).json({ users: returnUsers });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error getting users", error });
    }
  })
  .post(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    try {
      const existingUser = await GetUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await CreateUser(name, email, password, role);
      if (!user.acknowledged)
        return res.status(500).json({ message: "Error creating user" });
      return res.status(201).json({ userId: user.insertedId.toString() });
    } catch (error) {
      return res.status(500).json({ message: "User not created", error });
    }
  });

UserRoutes.route("/:userId")
  .get(async (req, res) => {
    try {
      const user = await GetUserById(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      delete user.password;
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Couldn't get user", error });
    }
  })
  .put(async (req, res) => {
    try {
      const userUpdated = await UpdateUser(
        req.params.userId,
        req.body.updateData
      );
      if (!userUpdated)
        return res.status(400).json({ message: "User not updated" });
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating user", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const userDeleted = await DeleteUser(req.params.userId);
      if (!userDeleted)
        return res.status(400).json({ message: "User not deleted" });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "User not deleted", error });
    }
  });

export default UserRoutes;
