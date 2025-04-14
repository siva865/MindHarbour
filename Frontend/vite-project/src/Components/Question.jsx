import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const answerVariants = {
        open: { height: 'auto', opacity: 1, marginTop: 15, transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] } },
        closed: { height: 0, opacity: 0, marginTop: 0, transition: { duration: 0.3, ease: [0.55, 0.085, 0.68, 0.53] } },
    };

    return (
        <div className="mb-8 rounded-xl shadow-lg overflow-hidden bg-[#FFF8F0]">
            <motion.div
                className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer flex justify-between items-center"
                onClick={toggleOpen}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <h3 className="text-2xl font-bold tracking-tight">{question}</h3>
                <button className="focus:outline-none p-2 rounded-full bg-white/20">
                    {isOpen ? <Minus size={28} className="text-white" /> : <Plus size={28} className="text-white" />}
                </button>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="px-6 py-4 bg-gray-50 text-lg text-gray-800"
                        variants={answerVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        {answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQsSection = () => {
    const faqData = [
        {
            question: "What is the definition of psychology?",
            answer: "Psychology is the scientific study of the mind and behavior. It explores how people think, feel, and act, and the processes underlying these actions. It encompasses a wide range of subfields, including cognitive, developmental, social, and clinical psychology."
        },
        {
            question: "What are the main goals of psychology?",
            answer: "The primary objectives of psychology are to describe behavior and mental processes through careful observation, explain these phenomena by identifying their causes, predict future behaviors based on understanding, and ultimately, to influence or control behavior in positive ways to enhance human well-being."
        },
        {
            question: "What is the difference between clinical psychology and counseling psychology?",
            answer: "While both clinical and counseling psychologists provide mental health services, clinical psychology often focuses on diagnosing and treating more severe psychological disorders. Counseling psychology tends to address adjustment issues, personal development, and career guidance, often working with individuals facing common life stressors."
        },
        {
            question: "What is the nature vs. nurture debate in psychology?",
            answer: "The enduring debate of nature versus nurture examines the extent to which our traits and behaviors are determined by our genetic inheritance (nature) versus our experiences and environment (nurture). Modern psychology recognizes the intricate interplay between these two forces in shaping who we are."
        },
        {
            question: "What are the stages of cognitive development according to Piaget?",
            answer: "Jean Piaget's theory outlines four key stages of cognitive development: the sensorimotor stage (birth to 2 years), the preoperational stage (2 to 7 years), the concrete operational stage (7 to 11 years), and the formal operational stage (12 years and beyond), each characterized by distinct ways of thinking and understanding the world."
        },
        {
            question: "What are the 'Big Five' personality traits?",
            answer: "The 'Big Five' or Five-Factor Model (FFM) is a widely accepted model of personality, identifying five broad dimensions of personality: Openness to experience, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (often remembered by the acronym OCEAN or CANOE). These traits represent fundamental aspects of individual differences in personality."
        },
        {
            question: "What is classical conditioning, and who is associated with it?",
            answer: "Classical conditioning is a learning process discovered by Ivan Pavlov, where an association is made between a neutral stimulus and a naturally occurring stimulus. Through repeated pairings, the neutral stimulus becomes a conditioned stimulus, eliciting a conditioned response similar to the original unconditioned response."
        },
        {
            question: "What is the fight-flight-freeze response?",
            answer: "The fight-flight-freeze response is an instinctive physiological reaction triggered by a perceived harmful event, attack, or threat to survival. It prepares the body to either confront the threat (fight), escape the threat (flight), or become immobile to avoid detection (freeze), driven by the sympathetic nervous system."
        },
        {
            question: "What are some common defense mechanisms in psychology?",
            answer: "Defense mechanisms are unconscious psychological strategies used to protect a person from anxiety arising from unacceptable thoughts or feelings. Examples include denial (refusing to accept reality), repression (unconsciously blocking distressing thoughts), projection (attributing one's own feelings to others), and sublimation (channeling unacceptable urges into socially acceptable behaviors)."
        },
        {
            question: "What is the importance of informed consent in psychological research and practice?",
            answer: "Informed consent is a critical ethical principle in psychology, ensuring that individuals voluntarily agree to participate in research or therapy after being fully informed about the nature of the study or treatment, potential risks and benefits, confidentiality, and their right to withdraw at any time. It upholds autonomy and respect for persons."
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200"id='FAQsSection'>
            <div className="max-w-5xl mx-auto px-8 md:px-16">
                <motion.h2
                    className="text-4xl font-extrabold text-center text-blue-800 mb-12 tracking-wider"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] }}
                >
                    Frequently Asked Questions
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delayChildren: 0.3, staggerChildren: 0.2 }}
                >
                    {faqData.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQsSection;