import express from "express";
import {
  createWorkShift,
  updateWorkShift,
  deleteWorkShift,
  getWorkShiftsByDate
} from "../controller/workShiftController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/addnew", isAdminAuthenticated, createWorkShift);
router.put("/update/:id", isAdminAuthenticated, updateWorkShift);
router.delete("/delete/:id", isAdminAuthenticated, deleteWorkShift);
router.get("/by-date", isAdminAuthenticated, getWorkShiftsByDate); 

export default router;
