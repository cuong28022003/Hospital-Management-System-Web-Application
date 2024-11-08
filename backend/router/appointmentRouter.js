import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
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

router.post("/new", isPatientAuthenticated, postAppointment);
router.get("/all", isAdminAuthenticated, getAllAppointments);
router.put("/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/:id", isAdminAuthenticated, deleteAppointment);
router.get("/available-shifts",isPatientAuthenticated, getAvailableShiftsForDoctor);

router.get("/doctors/:id", isDoctorAuthenticated, getAppointmentsByDoctor);
router.put("/doctors/:id", isDoctorAuthenticated, updateAppointmentStatus);
router.delete("/doctors/:id", isDoctorAuthenticated, deleteAppointment);

router.get("/patients/:id", isPatientAuthenticated, getAppointmentsByPatient);
export default router;
