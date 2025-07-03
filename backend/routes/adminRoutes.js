import express from "express";
import { getAdminStats } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js";

const adminRouter = express.Router();
adminRouter.get("/stats", authMiddleware, getAdminStats);
export default adminRouter;
