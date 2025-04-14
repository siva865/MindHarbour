const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Booking = require("./Booking");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/psychologistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "siranjeevisabapathi@gmail.com",
    pass: "gbky iddc otlj awfz"
  }
});


app.post("/book", async (req, res) => {
  const bookingData = req.body;

  try {

    const newBooking = new Booking(bookingData);
    await newBooking.save();


    await transporter.sendMail({
      from: `"Mind Harbour" <your-email@gmail.com>`, 
      to: "psychologistfazila@gmail.com",
      subject: "🧠 New Booking Received",
      html: `
        <h3>New Booking</h3>
        <p><strong>Name:</strong> ${bookingData.name}</p>
        <p><strong>Age:</strong> ${bookingData.age}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
        <p><strong>Date:</strong> ${bookingData.date}</p>
        <p><strong>Time:</strong> ${bookingData.time}</p>
      `
    });

    res.status(201).json({ message: "Booking saved and email sent successfully!" });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to save booking or send email." });
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server started on http://localhost:5000");
});