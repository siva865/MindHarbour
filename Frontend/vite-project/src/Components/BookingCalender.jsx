import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UPIPaymentPC = ({ amount, upiID, isPaid, copyUPI }) => {
    const upiLink = `upi://pay?pa=${upiID}&pn=MindHarbour&am=${amount}&cu=INR`;

    return (
        <div className="mt-6 space-y-4 text-center">
            <div className="flex flex-col items-center gap-3">
                <QRCode value={upiLink} size={160} />
                <p className="text-sm text-gray-500">Scan this QR using Google Pay or PhonePe</p>
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    <span className="mr-3 font-medium">{upiID}</span>
                    <button
                        onClick={copyUPI}
                        className="bg-black text-white text-xs px-2 py-1 rounded hover:bg-gray-800"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {isPaid && (
                <div className="flex items-center justify-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-300 text-sm">
                    <span>✅</span>
                    <p>Payment received successfully! We'll contact you soon.</p>
                </div>
            )}
        </div>
    );
};

function BookingCalendar() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [isBooked, setIsBooked] = useState(false);
    const [paymentTimeoutId, setPaymentTimeoutId] = useState(null);
    const [upiID, setUpiID] = useState('siranjeevisabapathi@oksbi');

    const timeSlots = ['10:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'];
    const services = {
        counseling: { label: 'General Counseling – ₹500', amount: 500 },
        relationship: { label: 'Relationship Therapy – ₹800', amount: 800 },
        trauma: { label: 'Trauma Recovery – ₹1200', amount: 1200 },
    };

    const countries = ['India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Other'];
    const selectedServiceAmount = services[selectedService]?.amount || 0;
    const upiLink = `upi://pay?pa=${upiID}&pn=MindHarbour&am=${selectedServiceAmount}&cu=INR`;
    const isIndia = country.toLowerCase() === 'india';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    useEffect(() => {
        setPaymentConfirmed(false);
        setPaymentStatus('pending');
        setIsBooked(false);
        if (paymentTimeoutId) {
            clearTimeout(paymentTimeoutId);
        }
    }, [selectedDate, selectedTime, name, age, email, country, phone, selectedService, isIndia]);

    const copyUPI = () => {
        navigator.clipboard.writeText(upiID);
        alert('UPI ID copied!');
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !name || !age || !email || !country || !phone || !selectedService) {
            alert('Please fill in all details.');
            return;
        }

        const bookingData = {
            name,
            age,
            email,
            phone,
            country,
            date: selectedDate.toLocaleDateString(),
            time: selectedTime,
            service: services[selectedService]?.label || selectedService,
        };

        try {
            const response = await fetch('https://mindharbour-backend.onrender.com/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();
            console.log("Response from /book:", result);

            if (response.ok) {
                setBookingId(result.bookingId);
                if (result.paymentRequired) {
                    setShowPaymentOptions(true);
                    startPaymentPolling(result.bookingId, bookingData);
                } else {
                    alert("Booking confirmed without payment! We'll contact you soon.");
                }
            } else {
                if (result.booked) {
                    alert("❌ Time slot is already booked. Please choose a different time.");
                    setIsBooked(true);
                } else {
                    alert('❌ Failed to save booking: ' + result.error);
                }
            }
        } catch (error) {
            console.error(error);
            alert('❌ Error occurred while booking: ' + error.message);
        }
    };

    const startPaymentPolling = (bookingId, bookingData) => {
        console.log("Starting payment polling for bookingId:", bookingId);
        const intervalId = setInterval(async () => {
            try {
                const response = await fetch(`https://mindharbour-backend.onrender.com/check-payment/${bookingId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();
                console.log("Response from /check-payment:", result);

                if (response.ok) {
                    if (result.paymentSuccess) {
                        setPaymentConfirmed(true);
                        setPaymentStatus('success');
                        clearInterval(intervalId);
                        if (paymentTimeoutId) {
                            clearTimeout(paymentTimeoutId);
                        }
                        console.log("Payment successful!");

                        // ➡️ Save to Google Sheets after successful payment
                        await fetch('https://mindharbour-backend.onrender.com/save-to-sheets', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bookingData),
                        });

                        alert("✅ Payment successful! Booking confirmed. We'll contact you soon.");
                    } else if (result.paymentFailed) {
                        setPaymentStatus('failed');
                        clearInterval(intervalId);
                        if (paymentTimeoutId) {
                            clearTimeout(paymentTimeoutId);
                        }
                        alert("Payment Failed");
                        console.log("Payment failed");
                    }
                } else {
                    console.error("Error checking payment:", result.error);
                }
            } catch (error) {
                console.error("Error polling payment status:", error);
            }
        }, 3000);

        setPaymentTimeoutId(intervalId);
    };

    useEffect(() => {
        return () => {
            if (paymentTimeoutId) {
                clearTimeout(paymentTimeoutId);
            }
        };
    }, [paymentTimeoutId]);

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Book Your Session</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setSelectedTime(null);
                        }}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        placeholderText="Choose a date"
                        minDate={new Date()}
                    />
                </div>

                {selectedDate && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Time Slot</label>
                            <div className="grid grid-cols-2 gap-3">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${selectedTime === slot
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        disabled={isBooked}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border-gray-300 rounded-lg shadow-sm w-full text-sm p-2" />
                            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="border-gray-300 rounded-lg shadow-sm w-full text-sm p-2" />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-gray-300 rounded-lg shadow-sm w-full text-sm p-2" />
                            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-gray-300 rounded-lg shadow-sm w-full text-sm p-2" />
                            <select value={country} onChange={(e) => setCountry(e.target.value)} className="col-span-2 border-gray-300 rounded-lg shadow-sm text-sm p-2">
                                <option value="">-- Select Country --</option>
                                {countries.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="border-gray-300 rounded-lg shadow-sm text-sm w-full p-2">
                                <option value="">-- Choose Service --</option>
                                {Object.entries(services).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>

                        {showPaymentOptions && (
                            <div className="mt-6 space-y-4 text-center">
                                {isIndia ? (
                                    isMobile ? (
                                        <a href={upiLink} className="block bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">
                                            Pay ₹{selectedServiceAmount} via Google Pay
                                        </a>
                                    ) : (
                                        <UPIPaymentPC amount={selectedServiceAmount} upiID={upiID} copyUPI={copyUPI} isPaid={paymentConfirmed} />
                                    )
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        Payment options for countries other than India are not yet supported.
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    {paymentStatus === 'pending' && "Awaiting Payment Confirmation..."}
                                    {paymentStatus === 'success' && "✅ Payment successful! Booking confirmed."}
                                    {paymentStatus === 'failed' && "❌ Payment Failed. Please try again."}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
                            disabled={showPaymentOptions || paymentConfirmed || isBooked}
                        >
                            Confirm Booking
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BookingCalendar;
