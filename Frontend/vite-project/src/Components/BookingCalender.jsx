import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import UPIPaymentPC from './PaymentSection';
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
    const [paymentIntervalId, setPaymentIntervalId] = useState(null);
    const [upiID] = useState('siranjeevisabapathi@oksbi');
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    const timeSlots = ['10:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'];
    const services = {
        counseling: { label: 'General Counseling – ₹500', amount: 500 },
        relationship: { label: 'Relationship Therapy – ₹800', amount: 800 },
        trauma: { label: 'Trauma Recovery – ₹1200', amount: 1200 },
    };

    const countries = ['India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Other'];
    const selectedServiceAmount = services[selectedService]?.amount || 0;
    const isIndia = country?.toLowerCase() === 'india';

    useEffect(() => {
        // Check if device is mobile/tablet
        const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobileDevice(mobileCheck);
        
        return () => {
            if (paymentIntervalId) clearInterval(paymentIntervalId);
        };
    }, [paymentIntervalId]);

    const copyUPI = () => {
        navigator.clipboard.writeText(upiID);
        toast.success('✅ UPI ID copied!');
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !name || !age || !email || !country || !phone || !selectedService) {
            toast.error('❌ Please fill all the fields.');
            return;
        }

        const bookingData = {
            name, age, email, phone, country,
            date: selectedDate.toLocaleDateString(),
            time: selectedTime,
            service: services[selectedService]?.label || selectedService,
        };

        try {
            // In a real app, you would call your backend here
            // For demo, we'll simulate a booking ID
            const bookingId = 'demo-' + Date.now();
            setBookingId(bookingId);
            
            // Show payment options
            setShowPaymentOptions(true);
            
            // For demo, we'll skip the actual backend call
            // startPolling(bookingId, bookingData);
            
            // If on mobile and in India, open payment app immediately
            if (isMobileDevice && isIndia) {
                handleMobilePayment();
            }
            
            toast.success('✅ Please complete payment to confirm booking');
        } catch (err) {
            console.error(err);
            toast.error('❌ Error processing booking');
        }
    };

    const handleMobilePayment = () => {
        if (isMobileDevice && isIndia) {
            const paymentLink = `upi://pay?pa=${upiID}&pn=MindHarbour&am=${selectedServiceAmount}&cu=INR`;
            window.location.href = paymentLink;
        } else {
            toast.error('❌ Payment from outside India or on unsupported devices is not possible yet.');
        }
    };

    const retryPayment = () => {
        setPaymentConfirmed(false);
        setPaymentStatus('pending');
        if (isMobileDevice && isIndia) {
            handleMobilePayment();
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-2xl space-y-6">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-2xl font-bold text-center text-gray-800">Book Your Session</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 text-sm"
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
                                        disabled={isBooked}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold ${selectedTime === slot ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" />
                            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" />
                            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" />
                            <select value={country} onChange={(e) => setCountry(e.target.value)} className="col-span-2 border-gray-300 rounded-lg text-sm p-2">
                                <option value="">-- Select Country --</option>
                                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2 w-full">
                                <option value="">-- Choose Service --</option>
                                {Object.entries(services).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>

                        {showPaymentOptions && (
                            <div className="mt-6 space-y-4 text-center">
                                {isMobileDevice && isIndia ? (
                                    <div>
                                        <button
                                            onClick={handleMobilePayment}
                                            className="block bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full"
                                        >
                                            Open Payment App (₹{selectedServiceAmount})
                                        </button>
                                        <p className="text-sm text-gray-500 mt-2">
                                            If payment app didn't open, <button 
                                                onClick={handleMobilePayment}
                                                className="text-indigo-600 underline"
                                            >
                                                click here
                                            </button>
                                        </p>
                                    </div>
                                ) : (
                                    <UPIPaymentPC 
                                        amount={selectedServiceAmount} 
                                        upiID={upiID} 
                                        copyUPI={copyUPI} 
                                        isPaid={paymentConfirmed} 
                                        onRetry={retryPayment} 
                                    />
                                )}

                                <p className="text-sm text-gray-600">
                                    {paymentStatus === 'pending' && 'Awaiting Payment Confirmation...'}
                                    {paymentStatus === 'success' && '✅ Payment successful!'}
                                    {paymentStatus === 'failed' && '❌ Payment failed.'}
                                </p>
                            </div>
                        )}

                        {!showPaymentOptions && (
                            <button
                                onClick={handleBooking}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
                                disabled={isBooked}
                            >
                                Confirm Booking
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default BookingCalendar;