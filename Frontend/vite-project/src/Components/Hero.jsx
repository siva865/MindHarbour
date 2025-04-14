import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { Book, Info, X } from 'lucide-react';

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const backgroundGradient = 'bg-gradient-to-br from-[#D1F2EB] via-[#D8BFD8] to-[#F9F5EB]';

  return (
    <header id='Hero' className={`relative overflow-hidden min-h-[80vh] flex items-center justify-between px-6 md:px-16 ${backgroundGradient}`}>
      
      {/* Left content */}
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
          <Link to="booking" smooth={true} duration={600}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-black text-white px-6 py-3 rounded-xl shadow-md flex items-center"
            >
              <Book className="mr-2 h-4 w-4" /> Book a Session
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="bg-white border border-gray-300 px-6 py-3 rounded-xl shadow-sm flex items-center"
          >
            <Info className="mr-2 h-4 w-4" /> Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* Right circle logo */}
      <motion.div
        className="hidden md:flex items-center justify-center w-1/3 relative"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-60 h-60 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-5xl font-bold text-[#5C6AC4] shadow-2xl">
          MH
        </div>
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-xl"
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
              <h3 className="text-xl font-semibold text-black mb-2">About Mind Harbour</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Mind Harbour is a compassionate mental health studio, committed to supporting individuals through their healing journeys. Led by experienced psychologists, we offer a safe, confidential space to navigate life’s challenges with care and expertise.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Hero;
