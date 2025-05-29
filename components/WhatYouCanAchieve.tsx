import React from 'react';
import { motion } from 'framer-motion';

// Define variants for container animation
const containerVariants = {
  hidden: { opacity: 0 }, // Initial state: hidden with 0 opacity
  visible: {
    opacity: 1, // Final state: visible with 1 opacity
    transition: {
      staggerChildren: 0.15, // Stagger the animation of children by 0.15 seconds
      delayChildren: 0.3, // Delay the start of children animations by 0.3 seconds
    },
  },
};

// Define variants for individual list item animation
const itemVariants = {
  hidden: { opacity: 0, x: -50 }, // Initial state: hidden, moved 50px to the left
  visible: { opacity: 1, x: 0 }, // Final state: visible, at original position
};

// The WhatYouCanAchieve component, replicating the provided structure and styling
const WhatYouCanAchieve: React.FC = () => {
  return (
    <section className="py-16 md:py-24  dark:bg-gray-800 overflow-hidden w-full max-w-7xl rounded-xl  p-4 md:p-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading with Framer Motion animations */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-12 leading-tight"
          initial={{ opacity: 0, y: -20 }} // Initial state for animation
          whileInView={{ opacity: 1, y: 0 }} // Animate when in view
          viewport={{ once: true, amount: 0.5 }} // Trigger once when 50% in view
          transition={{ duration: 0.6 }} // Animation duration
        >
          What You Can Achieve
        </motion.h2>

        {/* Unordered list of benefits with Framer Motion container and item animations */}
        <motion.ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-lg text-gray-700 dark:text-gray-300"
          variants={containerVariants} // Apply container animation variants
          initial="hidden" // Initial state for the container
          whileInView="visible" // Animate container when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% in view
        >
          {/* Individual list items */}
          <motion.li
            className="cursor-pointer flex items-start bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants} // Apply item animation variants
          >
            <span className="text-2xl mr-4 text-blue-600 dark:text-blue-400">🚀</span>
            Cut emotional errors by up to 90%
          </motion.li>
          <motion.li
            className="cursor-pointer flex items-start bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
          >
            <span className="text-2xl mr-4 text-blue-600 dark:text-blue-400">⚡</span>
            Increase execution speed by 10x
          </motion.li>
          <motion.li
            className="cursor-pointer flex items-start bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
          >
            <span className="text-2xl mr-4 text-blue-600 dark:text-blue-400">⏰</span>
            Save hundreds of hours yearly
          </motion.li>
          <motion.li
            className="cursor-pointer flex items-start bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
          >
            <span className="text-2xl mr-4 text-blue-600 dark:text-blue-400">🔄</span>
            Combine multiple strategies for diversification
          </motion.li>
          <motion.li
            className="cursor-pointer flex items-start bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
          >
            <span className="text-2xl mr-4 text-blue-600 dark:text-blue-400">🤖</span>
            Run your trading business on autopilot
          </motion.li>
        </motion.ul>

        {/* Concluding paragraph with Framer Motion animations */}
        <motion.p
          className="mt-12 text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: 20 }} // Initial state for animation
          whileInView={{ opacity: 1, y: 0 }} // Animate when in view
          viewport={{ once: true, amount: 0.7 }} // Trigger once when 70% in view
          transition={{ duration: 0.6, delay: 0.4 }} // Animation duration and delay
        >
          Your strategy should work harder than you do.
        </motion.p>
      </div>
    </section>
  );
};

export default WhatYouCanAchieve; // Export the WhatYouCanAchieve component directly
