import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [service, setService] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentPolling, setPaymentPolling] = useState(null);

  const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/android|iphone|ipad|mobile/i.test(userAgent));
    };
    checkIsMobile();
  }, []);

  const isIndia = country.trim().toLowerCase() === 'india';
  const upiId = 'siranjeevisabapathi@oksbi';

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !name || !email || !country || !service) {
      alert('Please fill in all fields.');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('en-GB');

    const response = await fetch('https://mind-harbour-back.vercel.app/api/saveBooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, country, date: formattedDate, time: selectedTime, service }),
    });

    const data = await response.json();
    setBookingId(data.bookingId);

    if (isIndia) {
      setShowPaymentOptions(true);
      startPaymentPolling(data.bookingId);
    } else {
      setBookingConfirmed(true);
    }
  };

  const startPaymentPolling = (bookingId) => {
    const interval = setInterval(async () => {
      const res = await fetch(`https://mind-harbour-back.vercel.app/check-payment/${bookingId}`);
      const status = await res.json();
      if (status.paymentReceived) {
        clearInterval(interval);
        setBookingConfirmed(true);
      }
    }, 3000);

    setPaymentPolling(interval);
  };

  const getUPILink = () => {
    const amount = 500;
    const nameParam = encodeURIComponent('Mind Harbour');
    return `upi://pay?pa=${upiId}&pn=${nameParam}&am=${amount}&cu=INR`;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-[#A7D8F2] via-[#D1F2EB] via-[#FFB5A7] to-[#D8BFD8] min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Book a Session</h1>

      <div className="space-y-4 max-w-md w-full">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
          placeholderText="Select a date"
          className="w-full p-2 border rounded"
        />

        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select a time slot</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="w-full p-2 border rounded"
        />

        <select value={service} onChange={(e) => setService(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select a service</option>
          <option value="Individual Counseling">Individual Counseling - ₹500</option>
          <option value="Career Guidance">Career Guidance - ₹500</option>
          <option value="Relationship Counseling">Relationship Counseling - ₹500</option>
        </select>

        {!showPaymentOptions && !bookingConfirmed && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Confirm Booking
          </button>
        )}

        {showPaymentOptions && !bookingConfirmed && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Payment Required ₹500</h2>
            {isMobile ? (
              <a href={getUPILink()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Pay with Google Pay
              </a>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(getUPILink())}&size=200x200`}
                  alt="Scan to Pay"
                  className="mb-2"
                />
                <p>Scan to Pay via any UPI app</p>
              </div>
            )}

            <div className="mt-2 text-gray-500 text-sm">Waiting for payment confirmation...</div>
          </div>
        )}

        {bookingConfirmed && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            ✅ Payment successful! Booking confirmed.<br /> We'll contact you soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
