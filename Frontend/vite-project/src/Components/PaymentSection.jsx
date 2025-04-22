import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const UPIPaymentPC = ({ amount, upiID, onPaymentSuccess }) => {
    const [isPaid, setIsPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const upiLink = `upi://pay?pa=${upiID}&pn=MindHarbour&am=${amount}&cu=INR`;

    const copyUPI = () => {
        navigator.clipboard.writeText(upiID);
        alert('UPI ID copied to clipboard!');
    };

    const verifyPayment = () => {
        setIsLoading(true);
        // Simulate payment verification (in real app, call your backend API)
        setTimeout(() => {
            const paymentSuccess = Math.random() > 0.3; // 70% success rate for demo
            if (paymentSuccess) {
                setIsPaid(true);
                if (onPaymentSuccess) onPaymentSuccess();
            }
            setIsLoading(false);
        }, 2000);
    };

    const retryPayment = () => {
        setIsPaid(false);
    };

    return (
        <div className="mt-6 space-y-4 text-center">
            {!isPaid ? (
                <>
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

                    <div className="mt-4">
                        <button
                            onClick={verifyPayment}
                            disabled={isLoading}
                            className={`block w-full ${isLoading ? 'bg-blue-500' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-lg`}
                        >
                            {isLoading ? 'Verifying Payment...' : 'I Have Paid'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-300 text-sm">
                        <span>✅</span>
                        <p>Payment received successfully! We'll contact you soon.</p>
                    </div>
                    <button
                        onClick={retryPayment}
                        className="block bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
                    >
                        Retry Payment (For Testing)
                    </button>
                </div>
            )}
        </div>
    );
};

export default UPIPaymentPC;