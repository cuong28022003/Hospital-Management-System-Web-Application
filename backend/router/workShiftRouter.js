import express from "express";
import {
  getAllWorkShifts,
  getWorkShiftById,
  createWorkShift,
  updateWorkShift,
  deleteWorkShift,
  getWorkShiftsByDate,
} from "../controller/workShiftController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("", isPatientAuthenticated, getAllWorkShifts);
router.get("/:id", isAdminAuthenticated, getWorkShiftById);
router.post("", isAdminAuthenticated, createWorkShift);
router.put("/:id", isAdminAuthenticated, updateWorkShift);
router.delete("/:id", isAdminAuthenticated, deleteWorkShift);

export default router;
