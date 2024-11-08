import mongoose from "mongoose";

const shiftTimes = [
  "7AM - 8AM",
  "8AM - 9AM",
  "9AM - 10AM",
  "10AM - 11AM",
  "11AM - 12PM",
  "1PM - 2PM",
  "2PM - 3PM",
  "3PM - 4PM",
  "4PM - 5PM",
];

const workShiftSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date is required!"],
  },
  shiftNumber: {
    type: Number,
    required: [true, "Shift number is required!"],
    min: [1, "Shift number must be at least 1"],
    max: [shiftTimes.length, `Shift number cannot exceed ${shiftTimes.length}`],
  },
  shiftTime: {
    type: String,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Doctor ID is required!"],
  },
  status: {
    type: String,
    enum: ["Available", "Booked"],
    default: "Available",
  },
});

// Middleware để tự động thiết lập `shiftTime` dựa trên `shiftNumber`
workShiftSchema.pre("save", function (next) {
  if (this.shiftNumber >= 1 && this.shiftNumber <= shiftTimes.length) {
    this.shiftTime = shiftTimes[this.shiftNumber - 1]; // Đặt shiftTime dựa trên shiftNumber
  } else {
    const err = new Error(`Invalid shift number: ${this.shiftNumber}`);
    next(err);
  }
  next();
});

export const WorkShift = mongoose.model("WorkShift", workShiftSchema);
