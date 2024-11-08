import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import { WorkShift } from "../models/workShiftSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
    workShiftId,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address ||
    !workShiftId
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  // Xác thực workShiftId
  const workShift = await WorkShift.findById(workShiftId);
  if (!workShift || workShift.doctorId.toString() !== doctor._id.toString()) {
    return next(
      new ErrorHandler("Invalid or unavailable work shift selected", 400)
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
    workShiftId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment,
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
export const getAppointmentsByDoctor = catchAsyncErrors(async (req, res, next) => {
  const { doctorId } = req.params; 
  
  if (!doctorId) {
    return next(new ErrorHandler("Doctor ID is required", 400));
  }
  
  const appointments = await Appointment.find({ doctorId });
  
  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("No appointments found for this doctor", 404));
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});
export const getAppointmentsByPatient = catchAsyncErrors(async (req, res, next) => {
  const { patientId } = req.params;

  if (!patientId) {
    return next(new ErrorHandler("Patient ID is required", 400));
  }

  const appointments = await Appointment.find({ patientId });

  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("No appointments found for this patient", 404));
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});

// Lấy danh sách ca làm việc khả dụng của bác sĩ
export const getAvailableShiftsForDoctor = catchAsyncErrors(async (req, res, next) => {
  const { doctorId, appointment_date } = req.query;

  if (!doctorId || !appointment_date) {
    return next(new ErrorHandler("Please provide doctor ID and appointment date", 400));
  }

  // Tìm các ca làm việc có `doctorId`, ngày là `appointment_date`, và trạng thái `available`
  const availableShifts = await WorkShift.find({
    doctorId,
    date: appointment_date,
    status: "available",
  });

  if (!availableShifts.length) {
    return next(new ErrorHandler("No available shifts found for this doctor on the selected date", 404));
  }

  res.status(200).json({
    success: true,
    availableShifts,
  });
});
