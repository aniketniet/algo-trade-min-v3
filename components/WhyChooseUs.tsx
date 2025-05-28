import React from 'react';
import { motion } from 'framer-motion';
import WhatYouCanAchieve from './WhatYouCanAchieve';

// Define animation variants for the container
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of child elements
      delayChildren: 0.2,   // Delay the start of child animations
    },
  },
};

// Define animation variants for individual items (table rows and headers)
const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Start hidden, slightly below
  visible: { opacity: 1, y: 0 }, // Fade in and move to original position
};

const WhyChooseUs: React.FC = () => {
  return (
    // Section container with responsive padding and background colors for light/dark mode
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main heading with Framer Motion animations */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-12 leading-tight"
          initial={{ opacity: 0, y: -20 }} // Initial state: hidden, slightly above
          whileInView={{ opacity: 1, y: 0 }} // Animate to visible state when in view
          viewport={{ once: true, amount: 0.5 }} // Trigger once when 50% of element is in view
          transition={{ duration: 0.6 }} // Animation duration
        >
          Why Traders Choose Us Over Others
        </motion.h2>

        {/* Table container with Framer Motion animations */}
        <motion.div
          className="overflow-x-auto shadow-xl rounded-lg border border-gray-200 dark:border-gray-700"
          variants={containerVariants} // Apply container animation variants
          initial="hidden" // Initial state for the container
          whileInView="visible" // Animate to visible state when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% of element is in view
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {/* Table header */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {/* Feature column header */}
                <motion.th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  variants={itemVariants} // Apply item animation variants
                >
                  Feature
                </motion.th>
                {/* Others column header */}
                <motion.th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  variants={itemVariants} // Apply item animation variants
                >
                  Others
                </motion.th>
                {/* Algo Tradex Mind column header */}
                <motion.th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  variants={itemVariants} // Apply item animation variants
                >
                  Algo Tradex Mind
                </motion.th>
              </tr>
            </thead>
            {/* Table body with feature rows */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Row: Broker Lock-in */}
              <motion.tr variants={itemVariants}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">
                  Broker Lock-in
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                  Yes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-600 dark:text-green-400">
                  ❌ No
                </td>
              </motion.tr>
              {/* Row: Coding Required */}
              <motion.tr variants={itemVariants}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">
                  Coding Required
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                  ✅
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-600 dark:text-green-400">
                  ❌ No Code Needed
                </td>
              </motion.tr>
              {/* Row: Backtest Speed */}
              <motion.tr variants={itemVariants}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">
                  Backtest Speed
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                  Slow
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-600 dark:text-green-400">
                  ⚡ Lightning Fast
                </td>
              </motion.tr>
              {/* Row: Strategy Sharing */}
              <motion.tr variants={itemVariants}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">
                  Strategy Sharing
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                  Rare
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-600 dark:text-green-400">
                  ✅ Built-In Marketplace
                </td>
              </motion.tr>
              {/* Row: Portfolio View */}
              <motion.tr variants={itemVariants}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">
                  Portfolio View
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                  Limited
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-600 dark:text-green-400">
                  📊 Unified Dashboard
                </td>
              </motion.tr>
              {/* Row: Support Team */}
              <motion.tr variants={itemVariants}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">
                  Support Team
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                  Bot Replies
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-600 dark:text-green-400">
                  🧑‍💼 Human-First Support
                </td>
              </motion.tr>
            </tbody>
          </table>
        </motion.div>
        <div className='pt-20'>
        <WhatYouCanAchieve/>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;