import express from "express";
import {
  createWorkShift,
  updateWorkShift,
  deleteWorkShift,
  getWorkShiftsByDate
} from "../controller/workShiftController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", isAdminAuthenticated, createWorkShift);
router.put("/:id", isAdminAuthenticated, updateWorkShift);
router.delete("/:id", isAdminAuthenticated, deleteWorkShift);
router.get("/date", isAdminAuthenticated, getWorkShiftsByDate); 

export default router;
