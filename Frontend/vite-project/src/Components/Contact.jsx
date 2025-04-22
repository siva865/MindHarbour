import React, { useState } from 'react';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionStatus(null); // Reset status on new submission

        const formData = {
            name: name,
            email: email,
            message: message,
        };

        try {
            const response = await fetch('/api/send-message', { // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.message) {
                setSubmissionStatus('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setSubmissionStatus('error');
                console.error('Submission failed:', data.error);
            }
        } catch (error) {
            setSubmissionStatus('error');
            console.error('There was an error sending the message:', error);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#F9F5EB] to-[#FFB5A7] rounded-xl shadow-lg p-8" id='ContactForm'>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Get in Touch</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                    <textarea
                        id="message"
                        rows="4"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                    Send Message
                </button>

                {submissionStatus === 'success' && (
                    <p className="text-green-500 mt-4">Message sent successfully!</p>
                )}
                {submissionStatus === 'error' && (
                    <p className="text-red-500 mt-4">Failed to send message. Please try again later.</p>
                )}
            </form>
        </div>
    );
};

const ContactInfo = () => {
    const companyName = "Mind Harbour";
    const address = "123 Serene Street, Tranquil City, MH 400001, India";
    const email = "info@mindharbour.com";
    const phone = "+91 9876543210"; // Example phone number

    return (
        <div className="text-gray-700">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">{companyName}</h2>
            <p className="mb-4">
                <strong className="font-bold">Address:</strong> {address}
            </p>
            <p className="mb-2">
                <strong className="font-bold">Email:</strong> {email}
            </p>
            <p className="mb-2">
                <strong className="font-bold">Phone:</strong> {phone}
            </p>
            {/* You can add social media links or other contact details here */}
        </div>
    );
};

const ContactSection = () => {
    return (
        <div className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Left Side: Contact Information */}
                <div className="md:order-1">
                    <ContactInfo />
                </div>

                {/* Right Side: Contact Form */}
                <div className="md:order-2">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
};

export default ContactSection;