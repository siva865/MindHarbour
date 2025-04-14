import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserAlt,
    FaHeart,
    FaChild,
    FaUsers,
    FaExclamationCircle,
    FaLeaf,
} from 'react-icons/fa';

// --- Helper Components ---
const FancyServiceCard = ({ icon: Icon, title, description, bgFrom, bgTo }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`bg-gradient-to-br ${bgFrom} ${bgTo} rounded-xl p-6 shadow-lg transition-all duration-500
                       border border-white/10 backdrop-blur-md relative`}
            whileHover={{ scale: 1.06, y: -8, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    transition: 'background-color 0.3s ease',
                }}
            >
                <Icon className="text-3xl text-[#302b63]" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 drop-shadow-sm">{title}</h3>
            <p className="text-sm text-gray-800 leading-relaxed">
                {description}
            </p>
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-4 right-4 bg-[#5C6AC4] text-white px-3 py-1 rounded-full text-xs font-medium shadow-md"
                    >
                        Learn More
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Main Component ---
export function Services() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const servicesData = [
        {
            icon: FaUserAlt,
            title: 'Individual Therapy',
            description: 'Personalized 1-on-1 sessions for emotional wellness.',
            bgFrom: 'from-blue-200',
            bgTo: 'to-purple-200',
        },
        {
            icon: FaHeart,
            title: 'Couples Counseling',
            description: 'Helping partners build connection and trust.',
            bgFrom: 'from-pink-200',
            bgTo: 'to-red-200',
        },
        {
            icon: FaChild,
            title: 'Child & Adolescent Support',
            description: 'Specialized care for young minds.',
            bgFrom: 'from-green-200',
            bgTo: 'to-yellow-200',
        },
        {
            icon: FaUsers,
            title: 'Group Therapy',
            description: 'Supportive group sessions for shared experiences.',
            bgFrom: 'from-orange-200',
            bgTo: 'to-amber-200',
        },
        {
            icon: FaExclamationCircle,
            title: 'Crisis Intervention',
            description: 'Immediate support during mental health crises.',
            bgFrom: 'from-red-300',
            bgTo: 'to-rose-300',
        },
        {
            icon: FaLeaf,
            title: 'Holistic Wellness',
            description: 'Integrative approach to mental health.',
            bgFrom: 'from-teal-200',
            bgTo: 'to-emerald-200',
        },
    ];

    return (
        <section className="py-20 px-6 md:px-12 bg-gray-50"   style={{ backgroundColor: '#D1F2EB' }} id='Services'>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#302b63] drop-shadow-lg">
                    Our Services
                </h2>

                {/* Why Mind Harbour Section */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center text-[#302b63] mb-6">Why Mind Harbour?</h3>
                    <p className="text-center text-gray-700 max-w-3xl mx-auto mb-8">
                        At Mind Harbour, we provide a safe, comforting space for those seeking mental health support.
                        We offer personalized therapy, workshops, and mental health resources. Whether you're navigating
                        stress, anxiety, depression, or other concerns, we're here to help you heal, grow, and thrive.
                    </p>
                    <ul className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto text-gray-800 text-base">
                        <li className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                            <strong className="text-[#302b63]">Confidentiality Guaranteed:</strong> Your privacy is our top priority.
                        </li>
                        <li className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                            <strong className="text-[#302b63]">Expert Therapists:</strong> Experienced professionals providing compassionate care.
                        </li>
                        <li className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                            <strong className="text-[#302b63]">Comprehensive Services:</strong> Therapy, workshops, and mental health products.
                        </li>
                        <li className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                            <strong className="text-[#302b63]">Flexible Online Sessions:</strong> Accessible from the comfort of your home.
                        </li>
                    </ul>
                </div>

                {/* Services Grid */}
                <div className={isMobile ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
                    {servicesData.map((service, index) => (
                        <FancyServiceCard
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            bgFrom={service.bgFrom}
                            bgTo={service.bgTo}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services;
