import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  const timeSlots = ['10:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'];
  const services = {
    counseling: { label: 'General Counseling – ₹500', amount: 500 },
    relationship: { label: 'Relationship Therapy – ₹800', amount: 800 },
    trauma: { label: 'Trauma Recovery – ₹1200', amount: 1200 },
  };

  const countries = ['India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Other'];
  const selectedServiceAmount = services[selectedService]?.amount || 0;
  const upiID = 'siranjeevisabapathi@oksbi';
  const upiLink = `upi://pay?pa=${upiID}&pn=MindHarbour&am=${selectedServiceAmount}&cu=INR`;
  const isIndia = country.toLowerCase() === 'india';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const copyUPI = () => {
    navigator.clipboard.writeText(upiID);
    alert('UPI ID copied!');
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !name || !age || !email || !country || !phone || !selectedService) {
      alert('Please fill in all details.');
      return;
    }

    // Assume payment completed after QR/redirect for now
    setPaymentConfirmed(true);

    const bookingData = {
      name,
      age,
      email,
      phone,
      country,
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      service: services[selectedService]?.label || selectedService,
      paid: true,
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbznoC4s3RXhhJ-Gbt4HO_tzHMrZNjAAYi1hO7Z7yk3l2iSbyxooL58o4lddBTY-gVGV7w/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Booking saved successfully!");
      } else {
        alert("❌ Failed to save booking.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error occurred while saving booking.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Book Your Session</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedTime(null);
          }}
          className="w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholderText="Choose a date"
          minDate={new Date()}
        />
      </div>

      {selectedDate && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Time Slot:</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-4 rounded-md border text-sm font-medium ${
                    selectedTime === slot ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm block w-full text-sm"
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm block w-full text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm block w-full text-sm"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm block w-full text-sm"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="col-span-2 border-gray-300 rounded-md shadow-sm text-sm"
            >
              <option value="">-- Select Country --</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service:</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm text-sm w-full"
            >
              <option value="">-- Choose Service --</option>
              {Object.entries(services).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {isIndia && (
            <div className="mt-6 space-y-4 text-center">
              {isMobile ? (
                <a
                  href={upiLink}
                  className="block bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700"
                >
                  Pay ₹{selectedServiceAmount} via Google Pay
                </a>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <QRCode value={upiLink} size={140} />
                  <p className="text-sm text-gray-500">Scan with Google Pay / PhonePe</p>
                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-sm">
                    <span className="mr-3 font-medium">{upiID}</span>
                    <button
                      onClick={copyUPI}
                      className="bg-black text-white text-xs px-2 py-1 rounded-md"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleBooking}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 mt-6"
          >
            Confirm Booking
          </button>

          {paymentConfirmed && (
            <div className="flex items-center justify-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
              <span>✅</span> Booking saved successfully! We'll contact you soon.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingCalendar;
