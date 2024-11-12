import express from "express";
import {
  getAppointmentById,
  getAllAppointments,
  postAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getAvailableShiftsForDoctor,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("", isAdminAuthenticated, getAllAppointments);
router.get("/:id", isAdminAuthenticated, getAppointmentById);
router.post("", isPatientAuthenticated, postAppointment);
router.put("/:id", isAdminAuthenticated, updateAppointment);
router.put("/:id/status", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/:id", isAdminAuthenticated, deleteAppointment);

router.get("/available-shifts",isPatientAuthenticated, getAvailableShiftsForDoctor);

router.get("/doctors/:id", isDoctorAuthenticated, getAppointmentsByDoctor);
router.put("/doctors/:id", isDoctorAuthenticated, updateAppointmentStatus);
router.delete("/doctors/:id", isDoctorAuthenticated, deleteAppointment);

router.get("/patients/:id", isPatientAuthenticated, getAppointmentsByPatient);
export default router;
