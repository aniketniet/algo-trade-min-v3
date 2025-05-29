// components/WhoIsItFor.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react'; // Import CheckCircle from Lucide React
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Data for each target audience segment
const targetAudience = [
  {
    id: 1,
    title: 'Beginners',
    description: 'Start with pre-built strategies',
    icon: CheckCircle, // Assign the imported Lucide icon component
  },
  {
    id: 2,
    title: 'Retail Traders',
    description: 'Automate your edge',
    icon: CheckCircle,
  },
  {
    id: 3,
    title: 'Pro Traders',
    description: 'Scale operations effortlessly',
    icon: CheckCircle,
  },
  {
    id: 4,
    title: 'Algo Enthusiasts',
    description: 'Build and optimise with precision',
    icon: CheckCircle,
  },
  {
    id: 5,
    title: 'Strategy Creators',
    description: 'Monetise your logic through our marketplace',
    icon: CheckCircle,
  },
];

// Variants for the scroll animation
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1, // Stagger animation for child elements
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Trainer Component
 *
 * This component displays a section highlighting the different types of traders
 * the platform is designed for, using a responsive grid layout and Tailwind CSS.
 * It now includes Framer Motion scroll animations and ensures equal card heights.
 */
const Trainer = () => {
  return (
    // Section container with padding and a light background
    // motion.section for scroll animation on the entire section
    <motion.section
      className="py-16 bg-gray-50 sm:py-24 font-sans"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Animate once when 20% of section is in view
      variants={containerVariants}
    >
      {/* Max-width container to center content and apply horizontal padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered text content for the section heading */}
        <div className="text-center">
          {/* Superheading */}
          <motion.h2
            className="text-base text-indigo-600 font-semibold tracking-wide uppercase rounded-md"
            variants={itemVariants} // Apply item variant for individual animation
          >
            Who's It For?
          </motion.h2>
          {/* Main heading */}
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl rounded-md"
            variants={itemVariants} // Apply item variant for individual animation
          >
            This isn't just for "techies." Our platform is designed for any trader who wants more control.
          </motion.p>
          {/* Subheading/tagline */}
          <motion.p
            className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto rounded-md"
            variants={itemVariants} // Apply item variant for individual animation
          >
            No matter where you are in your trading journey, we meet you there.
          </motion.p>
        </div>

        {/* Grid container for the individual audience cards */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch"> {/* Added items-stretch for equal height */}
            {/* Map over the targetAudience array to render each card */}
            {targetAudience.map((item) => (
              // motion.div for individual card animation
              <motion.div
                key={item.id}
                className="pt-6 h-full" // Ensure parent div takes full height of grid row
                variants={itemVariants} // Apply item variant for individual animation
              >
                {/* Individual card styling with hover effects */}
                {/* h-full ensures the card itself fills the height of its parent grid cell */}
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
                  {/* Negative margin to lift the icon above the card's top edge */}
                  <div className="-mt-6 cursor-pointer flex-grow"> {/* flex-grow allows content to take available space */}
                    <div>
                      {/* Icon container with background, padding, and shadow */}
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        {/* Render the dynamic icon component, passing Tailwind classes directly */}
                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    {/* Card title */}
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900 rounded-md">
                      {item.title}
                    </h3>
                    {/* Card description */}
                    <p className="mt-5 text-base text-gray-500 rounded-md">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Trainer; // Export Trainer as the default component
