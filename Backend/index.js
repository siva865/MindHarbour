const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const validator = require("validator");

dotenv.config();

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "https://mind-harbour.vercel.app",
  "http://localhost:3000"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, validate: validator.isEmail },
  country: { type: String, required: true, trim: true },
  age: { type: Number, min: 12, max: 120 },
  phone: { type: String, validate: v => !v || validator.isMobilePhone(v) },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, trim: true },
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  bookingDate: { type: Date, default: Date.now },
  paymentId: { type: String }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

// Routes
app.post("/book", async (req, res) => {
  try {
    const { name, email, country, age, phone, date, time, service } = req.body;

    if (!name || !email || !country || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingBooking = await Booking.findOne({ date, time, status: { $ne: 'cancelled' } });
    if (existingBooking) {
      return res.status(409).json({ error: "Time slot unavailable" });
    }

    const booking = new Booking({ name, email, country, age, phone, date, time, service });
    await booking.save();

    res.status(201).json({ message: "Booking created", bookingId: booking._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Important: Correct route with :id
app.post("/simulate-payment/:id", async (req, res) => {
  try {
    const { success, paymentId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (success) {
      booking.paid = true;
      booking.status = 'confirmed';
      booking.paymentId = paymentId;
      await booking.save();
      res.json({ message: "Payment successful", booking });
    } else {
      booking.status = 'cancelled';
      await booking.save();
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
