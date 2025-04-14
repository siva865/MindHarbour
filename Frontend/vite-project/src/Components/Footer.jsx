import React from "react";

const Footer = () => {
    const primaryColor = "black";
    const textColor = "#F9F5EB";

    return (
        <footer style={{ backgroundColor: primaryColor, color: textColor }} className="py-12">
            <div className="max-w-6xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: textColor }}>
                        Mind Harbour
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                        Counselling psychologist and mental health advocate through exploration, helping you nurture your mind and emotions.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: textColor }}>Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/" style={{ color: textColor }} className="hover:underline">Home</a></li>
                        <li><a href="/about" style={{ color: textColor }} className="hover:underline">About</a></li>
                        <li><a href="/services" style={{ color: textColor }} className="hover:underline">Services</a></li>
                        <li><a href="/contact" style={{ color: textColor }} className="hover:underline">Contact</a></li>
                        <li><a href="/book" style={{ color: textColor }} className="hover:underline">Book a Session</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: textColor }}>Contact</h3>
                    <p className="text-sm mb-2">
                        Email: <a href="mailto:contact@mindharbour.in" style={{ color: textColor }} className="hover:underline">contact@mindharbour.in</a>
                    </p>
                    <p className="text-sm mb-4">
                        Phone: <a href="tel:+919876543210" style={{ color: textColor }} className="hover:underline">+91 98765 43210</a>
                    </p>

                    <div className="flex space-x-4 text-sm">
                        <a href="#" style={{ color: textColor }} className="hover:underline">Instagram</a>
                        <a href="#" style={{ color: textColor }} className="hover:underline">LinkedIn</a>
                    </div>
                </div>
            </div>

            <div className="border-t mt-8 pt-5 text-center text-sm" style={{ borderColor: "rgba(249,245,235,0.3)", color: textColor }}>
                © {new Date().getFullYear()} Mind Harbour. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
