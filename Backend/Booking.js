const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  age: { type: Number },
  phone: { type: String },
  date: { type: String },
  time: { type: String },
  service: { type: String },
  paid: { type: Boolean, default: false },
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);