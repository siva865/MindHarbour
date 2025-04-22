import React from 'react';
import { motion } from 'framer-motion';

const doctorPhoto = 'https://placehold.co/400x400/E0E0E0/FFFFFF?text=Fazila+Fathima&font=Montserrat';

const AboutUs = () => {
  const whatsappNumber = '+919445725588';

  const getWhatsAppLink = () => {
    return `https://wa.me/${whatsappNumber}`;
  };

  return (
    <section className="bg-gradient-to-br from-[#A7D8F2] via-[#D1F2EB] via-[#FFB5A7] to-[#D8BFD8] px-6 md:px-24 py-20" id="AboutUs">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Smooth Introduction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            About Mind Harbor Mental Health Studio
          </h2>
        </motion.div>

        {/* Main Content Without Headlines */}
        <div className="space-y-16">
          {/* Paragraph 1 */}
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-800 leading-relaxed text-center md:text-left"
          >
            At Mind Harbor, we are dedicated to creating a safe, compassionate space where individuals, couples, and families can heal, grow, and thrive.
            We believe everyone deserves access to quality mental health care, providing tools and support to help improve emotional well-being.
          </motion.p>

          {/* Paragraph 2 */}
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-800 leading-relaxed text-center md:text-left"
          >
            Our personalized, holistic approach combines therapy, coaching, and workshops, tailored to meet the unique needs of each individual or family, ensuring meaningful and lasting growth.
          </motion.p>

          {/* Paragraph 3 - Why Choose (without headline) */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-800 leading-relaxed text-center md:text-left"
          >
            With highly qualified professionals, tailored care plans, and a holistic healing model, Mind Harbor offers a safe and nurturing environment that supports every step of your mental health journey.
            Our proven results and client satisfaction speak to our commitment to excellence and compassionate care.
          </motion.p>
        </div>

        {/* Meet the Founder Section */}
        <div className="md:flex items-center gap-16">
          {/* Founder Photo */}
          <motion.div
            className="md:w-1/3 flex justify-center mb-12 md:mb-0"
            initial={{ opacity: 0, y: -60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img
              src={doctorPhoto}
              alt="Fazila Fathima, Founder of Mind Harbor"
              className="rounded-full border-4 border-purple-300/50 max-w-[80%] md:max-w-full"
            />
          </motion.div>

          {/* Founder Details without headline */}
          <motion.div
            className="md:w-2/3 text-center md:text-left space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-800 leading-relaxed">
              Hello, I'm <span className="font-semibold text-blue-600">Fazila Fathima</span>, founder of Mind Harbor Mental Health Studio.
              My passion for mental well-being and deep commitment to helping others inspired me to create a nurturing space for healing and growth.
            </p>

            <p className="text-lg text-gray-800 leading-relaxed">
              I hold a Masters of Science in Applied Psychology, an International Diploma in Child Psychology, and certifications as a Parenting Master Coach and in Psychotherapy.
              Over the years, I have worked with diverse clients facing anxiety, depression, trauma, relationship challenges, and parenting struggles.
            </p>

            <p className="text-lg text-gray-800 leading-relaxed">
              At Mind Harbor, I blend professional expertise with genuine empathy, offering personalized support to each unique individual.
              Whether through therapy, coaching, or workshops, my goal is to empower you with practical tools for self-discovery and transformation.
            </p>

            <div className="space-y-2 text-gray-800 text-lg pt-2">
              <p> M.Sc. in Applied Psychology, International Diploma in Child Psychology, Certified Parenting Master Coach, Certification in Psychotherapy, B.Sc. in Psychology.</p>
            </div>

            <p className="text-lg text-gray-800 leading-relaxed">
              I believe true healing comes from understanding, connection, and actionable steps. Every journey is unique, and at Mind Harbor, you will always find compassionate care tailored to your needs.
            </p>
          </motion.div>
        </div>

        {/* Client Satisfaction & Experience Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Years Experience */}
            <motion.div 
              className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-5xl font-bold text-blue-600 mb-2">8+</h3>
              <p className="text-lg text-gray-700">Years Experience</p>
            </motion.div>

            {/* Clients Helped */}
            <motion.div 
              className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-5xl font-bold text-purple-600 mb-2">500+</h3>
              <p className="text-lg text-gray-700">Clients Helped</p>
            </motion.div>

            {/* Client Satisfaction */}
            <motion.div 
              className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-5xl font-bold text-pink-600 mb-2">100%</h3>
              <p className="text-lg text-gray-700">Client Satisfaction</p>
            </motion.div>
          </div>

          {/* Let's Connect Button - Now links to WhatsApp */}
          <motion.a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Connect
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;