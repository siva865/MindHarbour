import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserAlt,
    FaHeart,
    FaChild,
} from 'react-icons/fa';

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>
                <h2 className="text-3xl font-bold mb-4 text-[#302b63]">{title}</h2>
                <p className="text-gray-700 whitespace-pre-line">{content}</p>
            </motion.div>
        </motion.div>
    );
};

// --- Helper Components ---
const FancyServiceCard = ({ icon: Icon, title, description, bgFrom, bgTo, onLearnMore }) => {
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
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-4 right-4 bg-[#5C6AC4] text-white px-3 py-1 rounded-full text-xs font-medium shadow-md"
                        onClick={onLearnMore}
                    >
                        Learn More
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Main Component ---
export function Services() {
    const [isMobile, setIsMobile] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

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
            description: 'Personalized therapy sessions to help you overcome challenges and improve mental well-being.',
            details: `Individual therapy provides a confidential, supportive space to explore your thoughts, feelings, and behaviors. Whether you're dealing with anxiety, depression, grief, or stress, our therapy sessions are designed to help you navigate life’s challenges.

We work together to understand the root causes of your struggles, develop coping strategies, and empower you with the tools you need to live a balanced and fulfilling life. We use evidence-based techniques to tailor each session to your unique needs, helping you make meaningful progress toward healing and personal growth.`,
            bgFrom: 'from-blue-200',
            bgTo: 'to-purple-200',
        },
        {
            icon: FaHeart,
            title: 'Couples Counseling',
            description: 'Improve communication, resolve conflicts, and strengthen your relationship with couples counseling.',
            details: `Couples counseling is designed to help partners address conflicts, improve communication, and rebuild trust. Whether you're dealing with relationship challenges, parenting differences, or simply wanting to deepen your emotional connection, our counseling sessions offer a supportive environment for both partners.

We’ll guide you through identifying patterns of behavior, understanding each other’s needs, and finding constructive solutions to strengthen your relationship. Our goal is to empower you to create a healthier, more fulfilling relationship built on mutual understanding, respect, and love.`,
            bgFrom: 'from-pink-200',
            bgTo: 'to-red-200',
        },
        {
            icon: FaChild,
            title: 'Parenting Coaching',
            description: 'Practical strategies to help you build stronger, positive relationships with your children.',
            details: `Parenting coaching is for parents seeking support in building effective communication, setting healthy boundaries, and fostering positive behavior. Whether you're raising toddlers or teens, our coaching services are designed to offer practical tools and strategies to address specific parenting challenges.

From managing sibling rivalry to guiding your child through emotional development, our coaching will help you approach parenting with confidence and compassion. Together, we will create personalized action plans to enhance your parenting skills and improve your family dynamics, all while reducing stress and strengthening your emotional connection with your child.`,
            bgFrom: 'from-green-200',
            bgTo: 'to-yellow-200',
        },
    ];

    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <section className="py-20 px-6 md:px-12 bg-gray-50" style={{ backgroundColor: '#D1F2EB' }} id="Services">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#302b63] drop-shadow-lg">
                    Our Services
                </h2>

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
                            onLearnMore={() => openModal(service.title, service.details)}
                        />
                    ))}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {modalOpen && (
                        <Modal
                            isOpen={modalOpen}
                            onClose={closeModal}
                            title={modalTitle}
                            content={modalContent}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default Services;
