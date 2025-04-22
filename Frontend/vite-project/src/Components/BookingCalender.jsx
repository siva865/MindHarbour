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
    const [selectedAudioService, setSelectedAudioService] = useState('');
    const [selectedVideoService, setSelectedVideoService] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [isBooked, setIsBooked] = useState(false); // Track if a slot is booked
    const [paymentIntervalId, setPaymentIntervalId] = useState(null);
    const [upiID] = useState('siranjeevisabapathi@oksbi');
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]); // Array to store booked date-time slots

    const timeSlots = ['10:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'];
    const services = {
        in: {
            audio: {
                individual: { label: 'Individual Therapy – ₹799', amount: 799, type: 'individual', medium: 'audio' },
                couple: { label: 'Couples Counseling – ₹999', amount: 999, type: 'couple', medium: 'audio' },
                parenting: { label: 'Parenting Coaching – ₹999', amount: 999, type: 'parenting', medium: 'audio' },
            },
            video: {
                individual: { label: 'Individual Therapy – ₹1299', amount: 1299, type: 'individual', medium: 'video' },
                couple: { label: 'Couple Counseling – ₹1499', amount: 1499, type: 'couple', medium: 'video' },
                parenting: { label: 'Parenting Coaching – ₹1499', amount: 1499, type: 'parenting', medium: 'video' },
            },
        },
        intl: {
            audio: {
                individual: { label: 'Individual Therapy – ₹999', amount: 999, type: 'individual', medium: 'audio' },
                couple: { label: 'Couple Counseling – ₹1199', amount: 1199, type: 'couple', medium: 'audio' },
                parenting: { label: 'Parenting Coaching – ₹1199', amount: 1199, type: 'parenting', medium: 'audio' },
            },
            video: {
                individual: { label: 'Individual Therapy – ₹1499', amount: 1499, type: 'individual', medium: 'video' },
                couple: { label: 'Couple Counseling – ₹1699', amount: 1699, type: 'couple', medium: 'video' },
                parenting: { label: 'Parenting Coaching – ₹1699', amount: 1699, type: 'parenting', medium: 'video' },
            },
        },
    };

    const countries = ['India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Other'];
    const isIndia = country?.toLowerCase() === 'india';

    const selectedAudioServiceData = isIndia ? services.in?.audio[selectedAudioService] : services.intl?.audio[selectedAudioService];
    const selectedVideoServiceData = isIndia ? services.in?.video[selectedVideoService] : services.intl?.video[selectedVideoService];
    const selectedServiceAmount = selectedAudioServiceData?.amount || selectedVideoServiceData?.amount || 0;
    const selectedServiceName = selectedAudioServiceData?.label || selectedVideoServiceData?.label || '';

    useEffect(() => {
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

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const isSlotBooked = (timeSlot) => {
        if (selectedDate) {
            const dateString = selectedDate.toLocaleDateString();
            return bookedSlots.some(slot => slot.date === dateString && slot.time === timeSlot);
        }
        return false;
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !name || !age || !email || !country || !phone || (!selectedAudioService && !selectedVideoService)) {
            toast.error('❌ Please fill all the fields and select a service.');
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
            service: selectedServiceName,
        };

        try {
            const bookingId = 'temp-' + Date.now();
            setBookingId(bookingId);
            setBookedSlots([...bookedSlots, { date: selectedDate.toLocaleDateString(), time: selectedTime }]);
            setShowPaymentOptions(true);

            if (isMobileDevice && isIndia) {
                handleMobilePayment();
            }

            toast.success('✅ Please complete payment to confirm booking');
            setIsBooked(true);

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

    const getAudioServiceOptions = () => {
        return isIndia ? Object.entries(services.in?.audio || {}) : Object.entries(services.intl?.audio || {});
    };

    const getVideoServiceOptions = () => {
        return isIndia ? Object.entries(services.in?.video || {}) : Object.entries(services.intl?.video || {});
    };

    return (
        <div
            className="mx-auto p-8 bg-white rounded-3xl shadow-2xl space-y-6"
            style={{ maxWidth: '450px', maxHeight: '80vh', overflowY: 'auto' }}
        >
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-2xl font-bold text-center text-gray-800">Book Your Session</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
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
                                        disabled={isSlotBooked(slot) || isBooked}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold ${selectedTime === slot ? 'bg-indigo-600 text-white' : (isSlotBooked(slot) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200')}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" required />
                            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" required />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" required />
                            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-gray-300 rounded-lg text-sm p-2" required />
                            <select value={country} onChange={(e) => setCountry(e.target.value)} className="col-span-2 border-gray-300 rounded-lg text-sm p-2" required>
                                <option value="">-- Select Country --</option>
                                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Audio Counseling</label>
                            <select
                                value={selectedAudioService}
                                onChange={(e) => { setSelectedAudioService(e.target.value); setSelectedVideoService(''); }}
                                className="border-gray-300 rounded-lg text-sm p-2 w-full"
                            >
                                <option value="">-- Choose Audio Counseling --</option>
                                {getAudioServiceOptions().map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Video Counseling</label>
                            <select
                                value={selectedVideoService}
                                onChange={(e) => { setSelectedVideoService(e.target.value); setSelectedAudioService(''); }}
                                className="border-gray-300 rounded-lg text-sm p-2 w-full"
                            >
                                <option value="">-- Choose Video Counseling --</option>
                                {getVideoServiceOptions().map(([key, val]) => (
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

                        {!showPaymentOptions && selectedTime && (
                            <button
                                onClick={handleBooking}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
                                disabled={isBooked || (!selectedAudioService && !selectedVideoService)}
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