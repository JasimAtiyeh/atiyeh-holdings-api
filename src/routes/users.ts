import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../repos/users";

const UserRoutes = express.Router();
UserRoutes.use(express.json());

UserRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const users = await getUsers();
      if (!users.length) {
        return res.status(404).json({ message: "No users found" });
      }
      const sanitized = users.map(({ password, ...u }) => u);
      return res.status(200).json(sanitized);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  })
  .post(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const user = await createUser({ name, email, password, role });
      if (!user) return res.status(500).json({ message: "User not created" });
      return res.status(201).json({ id: user.id });
    } catch (error) {
      return res.status(500).json({ message: "Error creating user", error });
    }
  });

UserRoutes.route("/:userId")
  .get(async (req, res) => {
    try {
      const user = await getUserById(Number(req.params.userId));
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...sanitized } = user;
      return res.status(200).json(sanitized);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching user", error });
    }
  })
  .put(async (req, res) => {
    try {
      const success = await updateUser(Number(req.params.userId), req.body);
      if (!success)
        return res.status(400).json({ message: "User not updated" });
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating user", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const success = await deleteUser(Number(req.params.userId));
      if (!success)
        return res.status(400).json({ message: "User not deleted" });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting user", error });
    }
  });

export default UserRoutes;
