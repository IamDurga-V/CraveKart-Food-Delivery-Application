import express from "express";
import {
  validateOffer,
  createOffer,
  deleteOffer,
  getAllOffers,
} from "../controller/offerController.js";

const offerRouter = express.Router();
offerRouter.post("/validate", validateOffer);
offerRouter.post("/add", createOffer);
offerRouter.delete("/:id", deleteOffer);
offerRouter.get("/all", getAllOffers);
export default offerRouter;
