import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonialsData = [
    {
        name: "Priya Sharma",
        quote: "Mind Harbour has been a beacon of hope during a challenging time. The support I received was truly transformative.",
        rating: 5,
    },
    {
        name: "Rahul Verma",
        quote: "The guidance and understanding I found at Mind Harbour were invaluable. I feel much more resilient now.",
        rating: 5,
    },
    {
        name: "Sneha Patel",
        quote: "I wholeheartedly recommend Mind Harbour. The care and professionalism are exceptional.",
        rating: 4,
    },
    {
        name: "Aisha Khan",
        quote: "Finding Mind Harbour was a turning point for me. The therapists are skilled, empathetic, and truly dedicated.",
        rating: 5,
    },
];

const TestimonialCard = ({ testimonial }) => {
    const renderStars = (rating) => {
        return (
            <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={28}
                        stroke="#facc15" // Tailwind's amber-400
                        fill={i < rating ? "#facc15" : "none"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl mx-auto text-center">
            <p className="text-xl italic text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
            </p>
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">{testimonial.name}</h4>
            {renderStars(testimonial.rating)}
        </div>
    );
};

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

const TestimonialsSection = () => {
    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(([prevIndex]) => [(prevIndex + 1) % testimonialsData.length, 1]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-20 bg-gradient-to-br from-[#A7D8F2] to-[#D8BFD8]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-extrabold text-indigo-800 text-center mb-12 tracking-wider">
                    What Our Clients Are Saying
                </h2>
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "tween", duration: 0.5 }}
                            className="absolute w-full flex justify-center px-4"
                        >
                            <TestimonialCard testimonial={testimonialsData[currentIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;