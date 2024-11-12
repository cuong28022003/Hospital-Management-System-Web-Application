import express from "express";
import {
  patientRegister,
  login,
  addNewAdmin,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
  logoutDoctor,
  addNewDoctor,
  updateDoctor,
  deleteDoctor
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patients", patientRegister);
router.post("/login", login);
router.post("/admins", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admins/me", isAdminAuthenticated, getUserDetails);
router.get("/patients/me", isPatientAuthenticated, getUserDetails);
router.get("/doctors/me", isDoctorAuthenticated, getUserDetails);
router.get("/admins/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patients/logout", isPatientAuthenticated, logoutPatient);
router.get("/doctors/logout", isDoctorAuthenticated, logoutDoctor);
router.post("/doctors", isAdminAuthenticated, addNewDoctor);
router.put("/doctors/:id", isAdminAuthenticated, updateDoctor);
router.delete("/doctors/:id", isAdminAuthenticated, deleteDoctor);


export default router;
