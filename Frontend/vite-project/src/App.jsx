import React, { useState } from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Services from "./Components/Service";
import AboutMe from "./Components/About";
import Footer from "./Components/Footer";
import FAQsSection from "./Components/Question";
import TestimonialsSection from "./Components/Testimonioals";
import ContactSection from "./Components/Contact";
import BookingCalendar from "./Components/BookingCalender";
import { motion } from "framer-motion";

function App() {
  const [showBooking, setShowBooking] = useState(false);

  const onBookSession = () => {
    setShowBooking(true);
  };

  const closeBooking = () => {
    setShowBooking(false);
  };

  return (
    <div className="bg-[#F4F3FE] relative">
      <Header onBookSession={onBookSession} />
      <Hero />
      <Services />
      <AboutMe />
      <TestimonialsSection />
      <ContactSection />
      <FAQsSection />
      <Footer />
      {showBooking && (
  <motion.div
    className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30  bg-opacity-50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Book a Session</h2>
      {/* Here is the BookingCalendar component */}
      <BookingCalendar />
      <button
        onClick={closeBooking}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>
    </motion.div>
  </motion.div>
)}
    </div>
  );
}

export default App;
