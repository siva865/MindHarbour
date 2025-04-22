import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Info, X } from 'lucide-react';
import BookingCalendar from './BookingCalender';

function Hero() {
  const [showModal, setShowModal] = useState(false); // for Book a Session
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false); // for Learn More

  const backgroundGradient = 'bg-gradient-to-br from-[#D1F2EB] via-[#D8BFD8] to-[#F9F5EB]';

  return (
    <header id="Hero" className={`relative overflow-hidden min-h-[80vh] flex items-center justify-between px-6 md:px-16 ${backgroundGradient}`}>
      
      {/* Left Side Content */}
      <motion.div
        className="z-10 w-full md:w-2/3"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl md:text-4xl font-extrabold text-black">
          Mind Harbour Mental Health Studio
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6">
          Anchoring Hope, Healing Minds
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-8 max-w-xl leading-relaxed">
          Confidential, Compassionate Support for Your Mind and Soul
        </p>

        <div className="flex flex-wrap gap-4">
          
          {/* Book a Session Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-3 rounded-xl shadow-md flex items-center"
          >
            <Book className="mr-2 h-4 w-4" /> Book a Session
          </motion.button>

          {/* Learn More Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowLearnMoreModal(true)}
            className="bg-white border border-gray-300 px-6 py-3 rounded-xl shadow-sm flex items-center"
          >
            <Info className="mr-2 h-4 w-4" /> Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* Right Side Circle */}
      <motion.div
        className="hidden md:flex items-center justify-center w-1/3 relative"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-60 h-60 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-5xl font-bold text-black shadow-2xl">
          MH
        </div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-xl w-full relative shadow-xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>
              <BookingCalendar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learn More Modal */}
      <AnimatePresence>
        {showLearnMoreModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-xl w-full relative shadow-xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => setShowLearnMoreModal(false)}
              >
                <X />
              </button>

              {/* Mind Harbour Content */}
              <h2 className="text-2xl font-bold mb-4 text-center">About Mind Harbour</h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                At Mind Harbor, we’re dedicated to creating a safe, compassionate space where individuals, couples, and families can heal, grow, and thrive. 
                We believe that everyone deserves access to quality mental health care, and we provide the tools and support to help our clients improve their emotional well-being.
              </p>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

export default Hero;
