// ✅ Imports
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { google } = require("googleapis");

// ✅ Load environment variables
dotenv.config();
const app = express();

// ✅ CORS
const allowedOrigins = [
    "https://mind-harbour.vercel.app",
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());

// ✅ MongoDB Connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MongoDB URI not found in environment variables");
        }
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};
connectDB();

// ✅ Mongoose Schema & Model
const bookingSchema = new mongoose.Schema({
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

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// ✅ Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Google Sheets Setup
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function getGoogleSheetClient() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        const authClient = await auth.getClient();
        return google.sheets({ version: "v4", auth: authClient });
    } catch (error) {
        console.error("❌ Google Sheets authentication error:", error.message);
        throw error;
    }
}

// ✅ Append to Google Sheet (Dynamic by month)
async function appendToGoogleSheet(data) {
    const sheets = await getGoogleSheetClient();
    const bookingDateObj = new Date(data.bookingDate);
    const formattedBookingDate = bookingDateObj.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[bookingDateObj.getMonth()];
    const year = bookingDateObj.getFullYear();
    const dynamicSheetName = `${month}-${year}`;

    const values = [[
        data.name || "",
        data.email || "",
        data.country || "",
        data.age || "",
        data.phone || "",
        data.date || "",
        data.time || "",
        data.service || "",
        formattedBookingDate,
    ]];

    try {
        const sheetMetadata = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });

        const sheetExists = sheetMetadata.data.sheets.some(
            (sheet) => sheet.properties.title === dynamicSheetName
        );

        if (!sheetExists) {
            console.log(`📄 Creating new sheet: "${dynamicSheetName}"`);
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: dynamicSheetName } } }],
                },
            });

            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${dynamicSheetName}!A1:I1`,
                valueInputOption: "RAW",
                requestBody: {
                    values: [["Name", "Email", "Country", "Age", "Phone", "Date", "Time", "Service", "Booking Date"]],
                },
            });
            console.log(`✅ Headers added to new sheet: ${dynamicSheetName}`);
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${dynamicSheetName}!A:I`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values },
        });

        console.log(`✅ Booking saved to sheet: ${dynamicSheetName}`, response.data.updates.updatedRange);
    } catch (error) {
        console.error("❌ Error writing to Google Sheet:", error.message);
        throw error;
    }
}

// ✅ Booking API
app.post("/book", async (req, res) => {
    const { name, email, country, age, phone, date, time, service } = req.body;
    console.log("Received Booking Request:", req.body);
    if (!name || !email || !country) {
        return res.status(400).json({ error: "Required fields missing." });
    }

    try {
        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            return res.status(400).json({ error: "Time slot already booked", booked: true });
        }

        const newBooking = new Booking({ name, email, country, age, phone, date, time, service, paid: false });
        await newBooking.save();

        try {
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
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Service:</strong> ${service || "N/A"}</p>
                    <p><strong>Country:</strong> ${country}</p>
                `,
            });
        } catch (mailError) {
            console.error("❌ Email sending error:", mailError.message);
        }

        try {
            await appendToGoogleSheet({
                name,
                email,
                country,
                age,
                phone,
                date,
                time,
                service,
                bookingDate: newBooking.bookingDate,
            });
        } catch (sheetError) {
            console.error("❌ Sheet append error:", sheetError.message);
        }

        res.status(201).json({
            message: "Booking saved! Awaiting Payment Confirmation.",
            bookingId: newBooking._id,
            paymentRequired: true,
        });
    } catch (err) {
        console.error("❌ Booking error:", err.message);
        res.status(500).json({ error: "Booking failed", serverError: true });
    }
});

// ✅ Payment APIs
app.post("/simulate-payment/:id", async (req, res) => {
    const { success } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        if (success) {
            booking.paid = true;
            await booking.save();
            res.json({ message: "Payment successful!", paymentSuccess: true });
        } else {
            res.status(400).json({ error: "Payment failed", paymentFailed: true });
        }
    } catch (err) {
        console.error("❌ Simulate payment error:", err.message);
        res.status(500).json({ error: "Error processing payment", serverError: true });
    }
});

app.get("/check-payment/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        res.json({ paid: booking.paid, paymentSuccess: booking.paid });
    } catch (err) {
        console.error("❌ Check payment error:", err.message);
        res.status(500).json({ error: "Error checking payment status." });
    }
});

// ✅ Admin APIs
app.post("/mark-paid/:id", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { paid: true }, { new: true });
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        res.json({ message: "Booking marked as paid", booking });
    } catch (err) {
        console.error("❌ Mark paid error:", err.message);
        res.status(500).json({ error: "Error updating payment status" });
    }
});

app.post("/mark-failed/:id", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { paid: false }, { new: true });
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        res.json({ message: "Booking marked as failed", booking });
    } catch (err) {
        console.error("❌ Mark failed error:", err.message);
        res.status(500).json({ error: "Error updating booking status" });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
