import { WorkShift } from "../models/workShiftSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User} from "../models/userSchema.js"

export const createWorkShift = catchAsyncErrors(async (req, res, next) => {
  const { date, shiftNumber, doctor_firstName, doctor_lastName} = req.body;

  if (!date || !shiftNumber || !doctor_firstName || !doctor_lastName) {
    return next(
      new ErrorHandler("Date, shift number, and doctor's name are required!", 400)
    );
  }

  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
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

  const doctorId = isConflict[0]._id;
  const adminId = req.user._id;

  const existingShift = await WorkShift.findOne({
    date: new Date(date).toISOString().slice(0, 10), // Chuyển đổi sang định dạng chỉ lấy ngày
    shiftNumber,
    doctorId,
  });

  if (existingShift) {
    return next(
      new ErrorHandler(
        "Work shift already exists for this doctor on the specified date and shift number.",
        400
      )
    );
  }

  const workShift = await WorkShift.create({
    date: date,
    shiftNumber,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName
    },
    doctorId: doctorId,
    adminId: adminId
  });

  res.status(201).json({
    success: true,
    message: "Work shift created successfully!",
    workShift,
  });
});

export const updateWorkShift = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // ID của ca làm việc cần cập nhật
  const { date, shiftNumber, doctorId, status } = req.body;

  let workShift = await WorkShift.findById(id);

  if (!workShift) {
    return next(new ErrorHandler("Work shift not found!", 404));
  }

  // Cập nhật thông tin ca làm việc
  if (date) workShift.date = new Date(date);
  if (shiftNumber) workShift.shiftNumber = shiftNumber;
  if (doctorId) workShift.doctorId = doctorId;
  if (status) workShift.status = status;

  // Kiểm tra xem ca làm việc mới có trùng lặp không
  const conflictingShift = await WorkShift.findOne({
    date: workShift.date.toISOString().slice(0, 10),
    shiftNumber: workShift.shiftNumber,
    doctorId: workShift.doctorId,
    _id: { $ne: id }, // Bỏ qua ID hiện tại
  });

  if (conflictingShift) {
    return next(
      new ErrorHandler(
        "Conflicting work shift found for this doctor on the specified date and shift number.",
        400
      )
    );
  }

  await workShift.save();

  res.status(200).json({
    success: true,
    message: "Work shift updated successfully!",
    workShift,
  });
});

export const deleteWorkShift = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // ID của ca làm việc cần xóa

  const workShift = await WorkShift.findById(id);

  if (!workShift) {
    return next(new ErrorHandler("Work shift not found!", 404));
  }

  await workShift.deleteOne();

  res.status(200).json({
    success: true,
    message: "Work shift deleted successfully!",
  });
});

export const getAllWorkShifts = catchAsyncErrors(async (req, res, next) => {
  // Lấy tất cả các work shifts từ cơ sở dữ liệu
  const workShifts = await WorkShift.find();

  // Trả về danh sách work shifts
  res.status(200).json({
    success: true,
    workShifts,
  });
});

export const getWorkShiftsByDate = catchAsyncErrors(async (req, res, next) => {
  const { date } = req.query; // Lấy ngày từ query parameter

  if (!date) {
    return next(new ErrorHandler("Please provide a date.", 400));
  }
  const workShifts = await WorkShift.find({ date });

  if (workShifts.length === 0) {
    return next(
      new ErrorHandler("No work shifts found for the specified date.", 404)
    );
  }

  res.status(200).json({
    success: true,
    workShifts,
  });
});

// Lấy danh sách ca làm việc khả dụng của bác sĩ
export const getAvailableShiftsForDoctor = catchAsyncErrors(
  async (req, res, next) => {
    const { doctorId, appointment_date } = req.query;

    if (!doctorId || !appointment_date) {
      return next(
        new ErrorHandler("Please provide doctor ID and appointment date", 400)
      );
    }

    const availableShifts = await WorkShift.find({
      doctorId,
      date: appointment_date,
      status: "Available",
    });

    if (!availableShifts.length) {
      return next(
        new ErrorHandler(
          "No available shifts found for this doctor on the selected date",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      availableShifts,
    });
  }
);

export const getWorkShiftById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Tìm work shift dựa trên ID
  const workShift = await WorkShift.findById(id);

  // Kiểm tra nếu work shift không tồn tại
  if (!workShift) {
    return next(new ErrorHandler("Work Shift not found", 404));
  }

  // Trả về work shift nếu tìm thấy
  res.status(200).json({
    success: true,
    workShift,
  });
});