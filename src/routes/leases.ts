import express from "express";
import {
  CreateLease,
  DeleteLease,
  GetLeaseByHouseId,
  GetLeaseById,
  GetLeaseByTenantId,
  GetLeases,
  UpdateLease,
} from "../repos/leases";

const LeaseRoutes = express.Router();
LeaseRoutes.use(express.json());

LeaseRoutes.route("/")
  .get(async (_req, res) => {
    try {
      const leases = GetLeases();
      if (!leases) return res.status(404).json({ message: "No leases found" });
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
    )
      return res.status(400).json({
        message:
          "Deposit, end date, rent price, start date, tenant id, and house id are required",
      });

    try {
      const existingLease = await GetLeaseByHouseId(houseId);
      if (existingLease) {
        return res.status(400).json({ error: "Lease already exists" });
      }

      const lease = await CreateLease(
        deposit,
        endDate,
        rentPrice,
        startDate,
        tenantId,
        houseId
      );
      if (!lease.acknowledged)
        return res.status(500).json({ message: "Error creating lease" });
      return res.status(201).json({ leaseId: lease.insertedId.toString() });
    } catch (error) {
      return res.status(500).json({ message: "Lease not created", error });
    }
  });

LeaseRoutes.route("/:leaseId")
  .get(async (req, res) => {
    try {
      const lease = await GetLeaseById(req.params.leaseId);
      if (!lease) return res.status(404).json({ message: "Lease not found" });
      return res.status(200).json({ lease });
    } catch (error) {
      return res.status(500).json({ message: "Couldn't get lease", error });
    }
  })
  .put(async (req, res) => {
    try {
      const leaseUpdated = await UpdateLease(
        req.params.leaseId,
        req.body.updateData
      );
      if (!leaseUpdated)
        return res.status(400).json({ message: "Lease not updated" });
      return res.status(200).json({ message: "Lease updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating lease", error });
    }
  })
  .delete(async (req, res) => {
    try {
      const leaseDeleted = await DeleteLease(req.params.leaseId);
      if (!leaseDeleted)
        return res.status(400).json({ message: "Lease not deleted" });
      return res.status(200).json({ message: "Lease deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting lease", error });
    }
  });

LeaseRoutes.get("/:houseId", async (req, res) => {
  try {
    const lease = await GetLeaseByHouseId(req.params.houseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    return res.status(200).json({ lease });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get lease", error });
  }
});

LeaseRoutes.get("/:tenantId", async (req, res) => {
  try {
    const lease = await GetLeaseByTenantId(req.params.tenantId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    return res.status(200).json({ lease });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't get lease", error });
  }
});

export default LeaseRoutes;
