const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const validator = require("validator");
const nodemailer = require("nodemailer");
const { GoogleSpreadsheet } = require('google-spreadsheet');

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

// Booking Schema and Model (Keep as is)
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

// Contact Schema and Model (Keep as is)
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, validate: validator.isEmail },
    message: { type: String, required: true, trim: true },
    sentDate: { type: Date, default: Date.now },
}, { timestamps: true });
const Contact = mongoose.model("Contact", contactSchema);

// Nodemailer transporter setup (Keep as is)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Google Sheets Configuration
const SPREADSHEET_ID = '1i8zj276qNBwEK6T8IqzAXSka0afsZ9vPrOzkFg2JeYc'; // Your Sheet ID
const CREDENTIALS_PATH = './path/to/your/serviceAccountKey.json'; // **UPDATE THIS PATH**

async function appendToGoogleSheet(bookingData) {
    try {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
        await doc.useServiceAccountAuth(require(CREDENTIALS_PATH));
        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // Assuming you want to write to the first sheet
        await sheet.addRow(bookingData);
        console.log('✅ Booking data appended to Google Sheet');
    } catch (error) {
        console.error('❌ Error appending to Google Sheet:', error);
    }
}

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

        // --- LOG CLIENT DETAILS TO TERMINAL ---
        console.log("✅ New Booking Created:");
        console.log("  Name:", name);
        console.log("  Email:", email);
        console.log("  Country:", country);
        console.log("  Age:", age);
        console.log("  Phone:", phone);
        console.log("  Date:", date);
        console.log("  Time:", time);
        console.log("  Service:", service);
        console.log("  Booking ID:", booking._id);
        console.log("-------------------------");

        // --- APPEND TO GOOGLE SHEET ---
        const bookingForSheet = {
            Name: name,
            Email: email,
            Country: country,
            Age: age,
            Phone: phone,
            Date: date,
            Time: time,
            Service: service,
            BookingID: booking._id.toString(),
            BookingDate: new Date().toISOString(),
            PaymentStatus: 'Pending' // Initial status
        };
        await appendToGoogleSheet(bookingForSheet);

        res.status(201).json({ message: "Booking created", bookingId: booking._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

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

            // --- UPDATE GOOGLE SHEET ON PAYMENT SUCCESS (Optional) ---
            const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
            await doc.useServiceAccountAuth(require(CREDENTIALS_PATH));
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows({
                filter: row => row.BookingID === booking._id.toString()
            });
            if (rows.length > 0) {
                rows[0].PaymentStatus = 'Successful';
                if (paymentId) {
                    rows[0].PaymentID = paymentId;
                }
                await rows[0].save();
                console.log('✅ Google Sheet updated for successful payment');
            }

            res.json({ message: "Payment successful", booking });
        } else {
            booking.status = 'cancelled';
            await booking.save();

            // --- UPDATE GOOGLE SHEET ON PAYMENT FAILURE (Optional) ---
            const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
            await doc.useServiceAccountAuth(require(CREDENTIALS_PATH));
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows({
                filter: row => row.BookingID === booking._id.toString()
            });
            if (rows.length > 0) {
                rows[0].PaymentStatus = 'Failed';
                await rows[0].save();
                console.log('❌ Google Sheet updated for failed payment');
            }

            res.status(400).json({ error: "Payment failed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for handling contact form submissions and sending emails (Keep as is)
app.post("/api/send-message", async (req, res) => { /* ... */ });

// Global Error Handler (Keep as is)
app.use((err, req, res, next) => { /* ... */ });

// Start Server (Keep as is)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});