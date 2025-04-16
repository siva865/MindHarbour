const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Booking = require("./Booking");

dotenv.config();
const app = express();

// ✅ Allow both localhost:3000 and 5173 (for dev flexibility)
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/psychologistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ BOOK A SESSION
app.post("/book", async (req, res) => {
  const { name, email, country, age, phone, date, time, service } = req.body;

  if (!name || !email || !country) {
    return res.status(400).json({ error: "Required fields missing." });
  }

  try {
    const newBooking = new Booking({
      name, email, country, age, phone, date, time, service,
      paid: false,
    });

    await newBooking.save();

    await transporter.sendMail({
      from: `"Mind Harbour" <${process.env.EMAIL_USER}>`,
      to: "psychologistfazila@gmail.com",
      subject: "🧠 New Booking Received",
      html: `
        <h2>New Client Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Age:</strong> ${age || "N/A"}</p>
        <p><strong>Date:</strong> ${date || "N/A"}</p>
        <p><strong>Time:</strong> ${time || "N/A"}</p>
        <p><strong>Service:</strong> ${service || "N/A"}</p>
        <p><strong>Country:</strong> ${country}</p>
      `,
    });

    res.status(201).json({
      message: "Booking saved and email sent!",
      bookingId: newBooking._id,
    });

  } catch (err) {
    console.error("❌ Error in /book:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// ✅ POLL PAYMENT STATUS
app.get("/check-payment/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    console.log("🔎 Payment check for:", booking._id, "| Paid:", booking.paid);
    res.json({ paid: booking.paid });

  } catch (err) {
    console.error("❌ Error checking payment:", err);
    res.status(500).json({ error: "Error checking payment status." });
  }
});

// ✅ MARK AS PAID (for dev / admin)
app.post("/mark-paid/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paid: true },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Booking marked as paid", booking });
  } catch (err) {
    console.error("❌ Error marking as paid:", err);
    res.status(500).json({ error: "Error updating payment status" });
  }
});

// ✅ MARK AS FAILED (New endpoint)
app.post("/mark-failed/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paid: false }, // You might want to add a 'failed' status field in the future
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Booking marked as failed", booking });
  } catch (err) {
    console.error("❌ Error marking as failed:", err);
    res.status(500).json({ error: "Error updating booking status" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
