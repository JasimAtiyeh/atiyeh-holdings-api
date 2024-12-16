import express from "express";
import {
  createHouse,
  deleteHouse,
  getHouseById,
  getHouseForTenant,
  getHouses,
  getHousesForOwner,
  updateHouse,
} from "../repos/houses";

const HouseRoutes = express.Router();
HouseRoutes.use(express.json());

HouseRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const houses = await getHouses();
      if (!houses.length)
        return res.status(404).json({ message: "No houses found" });
      return res.status(200).json({ houses });
    } catch (error) {
      return res.status(500).json({ message: "Error getting houses", error });
    }
  })
  .post(async (req, res) => {
    const { address, name, ownerIds, details, tenantId } = req.body;
    if (!address || !name || !ownerIds || !ownerIds.length) {
      return res
        .status(400)
        .json({ message: "Address, name, and ownerIds are required" });
    }

    try {
      const existingHouses = await getHousesForOwner(ownerIds[0]);
      if (existingHouses && existingHouses.length > 0) {
        return res
          .status(400)
          .json({ message: "House already exists for this owner" });
      }

      const house = await createHouse(
        address,
        name,
        ownerIds,
        details ?? null,
        tenantId ?? null
      );
      if (!house)
        return res.status(500).json({ message: "Error creating house" });
      return res.status(201).json({ houseId: house.id });
    } catch (error) {
      return res.status(500).json({ message: "House not created", error });
    }
  });

HouseRoutes.route("/:houseId")
  .get(async (req, res) => {
    try {
      const house = await getHouseById(Number(req.params.houseId));
      if (!house) return res.status(404).json({ message: "House not found" });
      return res.status(200).json({ house });
    } catch (error) {
      return res.status(500).json({ message: "Couldn't get house", error });
    }
  })
  .put(async (req, res) => {
    const { updateData, updateDetails } = req.body;
    try {
      const success = await updateHouse(
        Number(req.params.houseId),
        updateData,
        updateDetails
      );
      if (!success)
        return res.status(400).json({ message: "House not updated" });
      return res.status(200).json({ message: "House updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating house", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const success = await deleteHouse(Number(req.params.houseId));
      if (!success)
        return res.status(400).json({ message: "House not deleted" });
      return res.status(200).json({ message: "House deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting house", error });
    }
  });

HouseRoutes.get("/user/:ownerId", async (req, res) => {
  try {
    const houses = await getHousesForOwner(Number(req.params.ownerId));
    if (!houses.length)
      return res
        .status(404)
        .json({ message: "No houses found for this owner" });
    return res.status(200).json({ houses });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get houses", error });
  }
});

HouseRoutes.get("/tenant/:tenantId", async (req, res) => {
  try {
    const house = await getHouseForTenant(Number(req.params.tenantId));
    if (!house)
      return res
        .status(404)
        .json({ message: "House not found for this tenant" });
    return res.status(200).json({ house });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get house", error });
  }
});

export default HouseRoutes;
