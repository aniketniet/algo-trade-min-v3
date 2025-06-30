"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const DisclaimerPage: React.FC = () => {
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-4 sm:p-6 lg:p-10 min-h-screen flex justify-center">
            <motion.div
                className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12 my-4 border border-blue-200 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 mb-4 text-center tracking-tight leading-tight">
                    Disclaimer
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    Algo Tradex Mind
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
                    Please read this Disclaimer carefully before using our platform.
                </p>

                {/* Introduction Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Please read this Disclaimer carefully before using the Algo Tradex Mind platform. By accessing or using our website, mobile app, tools, or any related services (collectively referred to as the "Platform"), you agree to the terms of this Disclaimer in full. If you do not agree, please do not use our services.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This Disclaimer forms part of and should be read together with our Terms of Use, Privacy Policy, and Risk Disclosure Document.
                    </p>
                </motion.section>

                {/* No Financial Advice Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">1. No Financial or Investment Advice</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind is a technology platform only. We provide infrastructure, tools, and data to help users build, test, and deploy algorithmic trading strategies.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We do not offer:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Investment advice</li>
                        <li>Portfolio management</li>
                        <li>Buy/sell recommendations</li>
                        <li>Personalised financial planning</li>
                        <li>Research reports or market signals</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        All decisions based on strategies created or deployed through our platform are made entirely at your own risk and discretion. If you require financial advice, we strongly recommend you consult a qualified financial advisor or regulatory-certified professional.
                    </p>
                </motion.section>

                {/* No Guarantee of Results Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">2. No Guarantee of Results</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind makes no guarantees—explicit or implied—regarding the performance, accuracy, or success of any trading strategy, backtest, or live deployment. Market behaviour is unpredictable and subject to numerous uncontrollable factors including (but not limited to) volatility, latency, slippage, liquidity, and external events.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Any past performance shown through the platform (whether simulated or actual) is not indicative of future results.
                    </p>
                </motion.section>

                {/* User Responsibility Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">3. User Responsibility</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You are solely responsible for:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>The strategies you build, modify, upload, test, or deploy</li>
                        <li>Ensuring they comply with all relevant laws and exchange/brokerage rules</li>
                        <li>Managing risk and monitoring your live positions</li>
                        <li>Linking your brokerage or demat accounts properly</li>
                        <li>Understanding your own financial goals, risk appetite, and regulatory obligations</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We do not monitor your trades or approve any algorithmic decisions on your behalf.
                    </p>
                </motion.section>

                {/* Third-Party Services Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">4. Third-Party Services and Brokers</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        To execute trades, our Platform integrates with third-party brokers or data providers. While we take reasonable care in choosing integration partners, we do not control or take responsibility for:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>The accuracy of third-party data</li>
                        <li>Execution of trades by external brokers</li>
                        <li>Delays or outages on external platforms</li>
                        <li>Security or privacy practices of third-party services</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        By linking your broker or data provider, you acknowledge that your interaction with them is governed by their terms and policies, not ours.
                    </p>
                </motion.section>

                {/* Platform Access Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">5. Platform Access and Availability</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        While we aim to provide uninterrupted service, we do not guarantee continuous availability or error-free operation of the Platform. Access may occasionally be restricted due to:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>System maintenance</li>
                        <li>Technical upgrades</li>
                        <li>Third-party server issues</li>
                        <li>Network problems beyond our control</li>
                        <li>Force majeure events (natural disasters, government restrictions, cyberattacks, etc.)</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We are not liable for any losses or interruptions that result from such events.
                    </p>
                </motion.section>

                {/* Educational Use Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">6. Educational Use and General Information</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        All content provided on the Platform—including articles, FAQs, videos, or other resources—is offered for informational and educational purposes only. It is not a substitute for professional advice and should not be relied upon for making trading decisions.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You are advised to perform your own due diligence or seek appropriate expert input before acting on any information presented on our platform.
                    </p>
                </motion.section>

                {/* Limitation of Liability Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">7. Limitation of Liability</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        To the fullest extent permitted by law, Algo Tradex Mind and its directors, employees, developers, affiliates, or partners shall not be liable for any direct, indirect, incidental, special, or consequential losses or damages, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Trading losses</li>
                        <li>Data loss or corruption</li>
                        <li>Service downtime or technical glitches</li>
                        <li>Loss of profits, goodwill, or opportunity</li>
                        <li>Third-party errors or failures</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This applies even if we have been advised of the possibility of such damages.
                    </p>
                </motion.section>

                {/* Regulatory Compliance Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">8. Regulatory Compliance</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind is a technology provider, not a financial advisor, broker, or registered investment intermediary. We are not regulated by SEBI or any other financial authority. Users are expected to ensure that their use of the Platform is in line with applicable laws, including those related to trading, taxation, and data protection.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We do not take responsibility for users breaching their local regulations or misusing the Platform in ways that violate compliance norms.
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
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">9. Intellectual Property</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        All content, code, design elements, and proprietary tools made available on Algo Tradex Mind are protected by copyright, trademark, and other intellectual property laws. Unauthorised reproduction, redistribution, or commercial use without written permission is strictly prohibited.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Any strategies, content, or data uploaded by you remain your intellectual property, but by sharing them on our Platform (e.g. in forums or public dashboards), you grant us a non-exclusive licence to display or distribute them as needed to operate the service.
                    </p>
                </motion.section>

                {/* Changes to Disclaimer Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">10. Changes to This Disclaimer</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind may update this Disclaimer at any time, without prior notice. It is your responsibility to check this page periodically. Continued use of the Platform after changes have been made will be taken as acceptance of the updated Disclaimer.
                    </p>
                </motion.section>

                {/* Jurisdiction Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">11. Jurisdiction and Governing Law</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This Disclaimer is governed by the laws of India. Any disputes arising out of your use of the Platform shall be resolved through arbitration as detailed in our Terms of Use, or through courts of competent jurisdiction located in India, if applicable.
                    </p>
                </motion.section>

                {/* Final Note Section */}
                <motion.section
                    className="border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Final Note</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We want our users to succeed, but it's important to understand that technology and trading carry risks. We've built Algo Tradex Mind to be as robust and transparent as possible, but the responsibility for how you use it—and the consequences—rests with you.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If you're ever unsure, reach out. We're here to help, but always within the boundaries of what's fair, legal, and ethical.
                    </p>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default DisclaimerPage;