const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  phone: String,
  date: String,
  time: String
});

module.exports = mongoose.model("Booking", bookingSchema);
