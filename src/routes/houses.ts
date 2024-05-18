import express from "express";
import {
  CreateHouse,
  DeleteHouse,
  GetHouseById,
  GetHouseForTenant,
  GetHouses,
  GetHousesForOwner,
  UpdateHouse,
} from "../repos/houses";
import { House } from "../models/houses";

const HouseRoutes = express.Router();
HouseRoutes.use(express.json());

HouseRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const houses = GetHouses();
      if (!houses)
        return res.sendStatus(404).json({ message: "No houses found" });
      return res.sendStatus(200).json({ houses });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error getting houses", error });
    }
  })
  .post(async (req, res) => {
    const { address, name, ownerIds } = req.body as House;

    if (!address || !name || !ownerIds)
      return res
        .sendStatus(400)
        .json({ message: "Address, name, and owner ids are required" });

    try {
      const owner = ownerIds.at(0)?.toString() as string;
      const existingHouse = await GetHousesForOwner(owner);
      if (existingHouse) {
        return res.status(400).json({ error: "House already exists" });
      }

      const house = await CreateHouse(address, name, ownerIds);
      if (!house.acknowledged)
        return res.status(500).json({ message: "Error creating house" });
      return res.status(201).json({ houseId: house.insertedId.toString() });
    } catch (error) {
      return res.status(500).json({ message: "House not created", error });
    }
  });

HouseRoutes.route("/:houseId")
  .get(async (req, res) => {
    try {
      const house = await GetHouseById(req.params.houseId);
      if (!house)
        return res.sendStatus(404).json({ message: "House not found" });
      return res.sendStatus(200).json({ house });
    } catch (error) {
      return res.sendStatus(500).json({ message: "Couldn't get house", error });
    }
  })
  .put(async (req, res) => {
    try {
      const houseUpdated = await UpdateHouse(
        req.params.houseId,
        req.body.updateData
      );
      if (!houseUpdated)
        return res.sendStatus(400).json({ message: "House not updated" });
      return res
        .sendStatus(200)
        .json({ message: "House updated successfully" });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error updating house", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const houseDeleted = await DeleteHouse(req.params.houseId);
      if (!houseDeleted)
        return res.sendStatus(400).json({ message: "House not deleted" });
      return res
        .sendStatus(200)
        .json({ message: "House deleted successfully" });
    } catch (error) {
      return res
        .sendStatus(500)
        .json({ message: "Error deleting House", error });
    }
  });

HouseRoutes.get("/:ownerId", async (req, res) => {
  try {
    const houses = await GetHousesForOwner(req.params.ownerId);
    if (!houses)
      return res.sendStatus(404).json({ message: "House not found" });
    return res.sendStatus(200).json({ houses });
  } catch (error) {
    return res.sendStatus(500).json({ message: "Couldn't get house", error });
  }
});

HouseRoutes.get("/:tenantId", async (req, res) => {
  try {
    const house = await GetHouseForTenant(req.params.tenantId);
    if (!house) return res.sendStatus(404).json({ message: "House not found" });
    return res.sendStatus(200).json({ house });
  } catch (error) {
    return res.sendStatus(500).json({ message: "Couldn't get house", error });
  }
});

export default HouseRoutes;
