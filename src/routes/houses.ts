import express from "express";

const HouseRoutes = express.Router();

HouseRoutes.get("/house/:houseId");

HouseRoutes.get("/houses/:userId");
