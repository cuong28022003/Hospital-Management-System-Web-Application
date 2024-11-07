import { WorkShift } from "../models/workShiftSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const createWorkShift = catchAsyncErrors(async (req, res, next) => {
  const { date, shiftNumber, doctorId } = req.body;

  if (!date || !shiftNumber || !doctorId) {
    return next(
      new ErrorHandler("Date, shift number, and doctor ID are required!", 400)
    );
  }

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
    date: new Date(date),
    shiftNumber,
    doctorId,
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

  await workShift.remove();

  res.status(200).json({
    success: true,
    message: "Work shift deleted successfully!",
  });
});

export const getWorkShiftsByDate = catchAsyncErrors(async (req, res, next) => {
  const { date } = req.query; // Lấy ngày từ query parameter

  if (!date) {
    return next(new ErrorHandler("Please provide a date.", 400));
  }

  const workShifts = await WorkShift.find({ date });

  if (workShifts.length === 0) {
    return next(new ErrorHandler("No work shifts found for the specified date.", 404));
  }

  res.status(200).json({
    success: true,
    workShifts,
  });
});