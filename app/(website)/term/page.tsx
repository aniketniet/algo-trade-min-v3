"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const TermsAndConditionsPage: React.FC = () => {
    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100,
                duration: 0.8
            }
        },
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 100,
                duration: 1,
                delay: 0.2
            }
        },
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-4 sm:p-6 lg:p-10 min-h-screen flex items-center justify-center">
            <motion.div
                className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12 my-8 border border-blue-200 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 mb-4 text-center tracking-tight leading-tight">
                    Terms of Use
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    Algo Tradex Mind
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
                    Welcome to Algo Tradex Mind. By accessing or using our website (algotradexmind.com), you agree to be bound by these Terms of Use.
                </p>

                {/* Access and Registration Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">1. Access and Registration</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        By registering with us or using any part of the site, you acknowledge that Algo Tradex Mind, including its team and affiliates, reserves the right to suspend or terminate your access—without prior notice—should we believe that your use of the site breaches these terms or poses a risk to the platform, our users, or our operations.
                    </p>
                </motion.section>

                {/* Licence to Use Our Content Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">2. Licence to Use Our Content</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You are welcome to view, download, and temporarily store content from the site for your personal, non-commercial use. However, this does not grant you any rights to reproduce, republish, share, or distribute any material from the site for commercial purposes without our express written permission.
                    </p>
                </motion.section>

                {/* Intellectual Property Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">3. Intellectual Property</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        All content, including text, graphics, logos, and other materials on this site, is the property of Algo Tradex Mind unless stated otherwise. We take the protection of our intellectual property seriously and reserve the right to take legal action—including seeking an injunction or damages—should any of our materials be used without permission or in breach of these terms.
                    </p>
                </motion.section>

                {/* Site Security Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">4. Site Security</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Maintaining the security and integrity of our platform is a top priority. Any unauthorized access to restricted areas of the website, misuse of login credentials, or any attempt to compromise the system is strictly prohibited and may result in legal consequences.
                    </p>
                </motion.section>

                {/* Updates to These Terms Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">5. Updates to These Terms</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We may revise these Terms of Use from time to time. Any updates will be posted on this page, and continued use of the site after changes have been made will be taken as your acceptance of the updated terms.
                    </p>
                </motion.section>

                {/* Contact Section */}
                <motion.section
                    className="border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Contact Us</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If you have any questions or concerns about these terms, you're welcome to contact us directly. Thank you for using Algo Tradex Mind responsibly.
                    </p>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default TermsAndConditionsPage;