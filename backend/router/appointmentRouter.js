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
<<<<<<< HEAD
router.get("/available-shifts", isPatientAuthenticated, getAvailableShiftsForDoctor);

=======
router.get("/doctorgetall/:doctorId", isDoctorAuthenticated, getAppointmentsByDoctor);
router.put("/doctorupdate/:id", isDoctorAuthenticated, updateAppointmentStatus);
router.delete("/doctordelete/:id", isDoctorAuthenticated, deleteAppointment);
router.get("/patientgetall/:patientId", isPatientAuthenticated, getAppointmentsByPatient);
>>>>>>> ae74c0cb11a3ca83566ee5385a55249961ad1f14
export default router;
