import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.get("/doctorgetall/:doctorId", isDoctorAuthenticated, getAppointmentsByDoctor);
router.put("/doctorupdate/:id", isDoctorAuthenticated, updateAppointmentStatus);
router.delete("/doctordelete/:id", isDoctorAuthenticated, deleteAppointment);
router.get("/patientgetall/:patientId", isPatientAuthenticated, getAppointmentsByPatient);
export default router;
