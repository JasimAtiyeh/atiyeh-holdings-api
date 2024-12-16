import express from "express";
import {
  createLease,
  deleteLease,
  getLeaseByHouseId,
  getLeaseById,
  getLeaseByTenantId,
  getLeases,
  updateLease,
} from "../repos/leases";

const LeaseRoutes = express.Router();
LeaseRoutes.use(express.json());

LeaseRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const leases = await getLeases();
      if (!leases.length)
        return res.status(404).json({ message: "No leases found" });
      return res.status(200).json({ leases });
    } catch (error) {
      return res.status(500).json({ message: "Error getting leases", error });
    }
  })
  .post(async (req, res) => {
    const { deposit, endDate, rentPrice, startDate, tenantId, houseId } =
      req.body;
    if (
      !deposit ||
      !endDate ||
      !rentPrice ||
      !startDate ||
      !tenantId ||
      !houseId
    ) {
      return res.status(400).json({ message: "All lease fields are required" });
    }

    try {
      const existingLease = await getLeaseByHouseId(houseId);
      if (existingLease)
        return res.status(400).json({ message: "Lease already exists" });

      const leaseId = await createLease(
        deposit,
        endDate,
        rentPrice,
        startDate,
        tenantId,
        houseId
      );
      return res.status(201).json({ leaseId });
    } catch (error) {
      return res.status(500).json({ message: "Lease not created", error });
    }
  });

LeaseRoutes.route("/:leaseId")
  .get(async (req, res) => {
    try {
      const lease = await getLeaseById(Number(req.params.leaseId));
      if (!lease) return res.status(404).json({ message: "Lease not found" });
      return res.status(200).json({ lease });
    } catch (error) {
      return res.status(500).json({ message: "Couldn't get lease", error });
    }
  })
  .put(async (req, res) => {
    try {
      const success = await updateLease(Number(req.params.leaseId), req.body);
      if (!success)
        return res.status(400).json({ message: "Lease not updated" });
      return res.status(200).json({ message: "Lease updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating lease", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const success = await deleteLease(Number(req.params.leaseId));
      if (!success)
        return res.status(400).json({ message: "Lease not deleted" });
      return res.status(200).json({ message: "Lease deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting lease", error });
    }
  });

LeaseRoutes.get("/house/:houseId", async (req, res) => {
  try {
    const lease = await getLeaseByHouseId(Number(req.params.houseId));
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    return res.status(200).json({ lease });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get lease", error });
  }
});

LeaseRoutes.get("/tenant/:tenantId", async (req, res) => {
  try {
    const lease = await getLeaseByTenantId(Number(req.params.tenantId));
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    return res.status(200).json({ lease });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get lease", error });
  }
});

export default LeaseRoutes;
