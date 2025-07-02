import express from "express";
import { getAdminStats } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js"; // ensure this verifies token and/or role

const adminRouter = express.Router();

// GET /admin/stats
adminRouter.get("/stats", authMiddleware, getAdminStats);



export default adminRouter;
