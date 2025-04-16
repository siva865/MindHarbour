import React from 'react';
import QRCode from 'react-qr-code';

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

export default UPIPaymentPC;
