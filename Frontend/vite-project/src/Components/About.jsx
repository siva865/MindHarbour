import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const doctorPhoto = 'https://placehold.co/400x400/E0E0E0/FFFFFF?text=Doctor&font=Montserrat';

const AboutMe = () => {
  const whatsappNumber = '+919445725588';

  const getWhatsAppLink = () => {
    return `https://wa.me/${whatsappNumber}`;
  };

  return (
    <section className="bg-gradient-to-br from-[#A7D8F2] via-[#D1F2EB] via-[#FFB5A7] to-[#D8BFD8] px-6 md:px-24 py-20" id='AboutMe'>
      <div className="max-w-7xl mx-auto md:flex items-center gap-16">
        {/* Doctor Photo */}
        <motion.div
          className="md:w-1/3 flex justify-center mb-12 md:mb-0"
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <img
            src={doctorPhoto}
            alt="Fazeela Fatima, Counselling Psychologist"
            className="rounded-full border-4 border-purple-300/50 max-w-[80%] md:max-w-full"
          />
        </motion.div>

        {/* Doctor Bio */}
        <motion.div
          className="md:w-2/3 text-center md:text-left space-y-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            About Fazeela Fatima
          </h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Hello! I'm <span className="font-semibold text-blue-600">Fazeela Fatima</span>, the founder of Mind Harbour.
            I'm a dedicated counselling psychologist passionate about guiding individuals through emotional healing,
            self-discovery, and growth. Whether you're seeking clarity, comfort, or transformation — I'm here for you.
          </p>

          {/* WhatsApp Button */}
          <motion.a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg
                       hover:from-green-500 hover:to-blue-600 transition-all duration-300
                       border-2 border-white/20 hover:scale-105  font-medium text-lg"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp className="h-6 w-6" />
            <span className="font-bold">Connect on WhatsApp</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
