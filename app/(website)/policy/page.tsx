"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const PrivacyPolicyPage: React.FC = () => {
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
                    Privacy Policy
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    Algo Tradex Mind
                </h2>
                <p className="text-base sm:text-lg text-gray-500 mb-10 text-center font-medium">
                    Effective Date: 26 June 2025
                </p>
                <p className="text-lg sm:text-xl text-gray-700 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
                    Your privacy is extremely important to us, and we're committed to handling your information responsibly and transparently.
                </p>

                {/* Introduction Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">1. Introduction</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Welcome to Algo Tradex Mind ("we", "us", or "our"). This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you interact with our products and services, including our website, mobile apps, and any other online platforms we operate (collectively referred to as the "Platform").
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        By using the Platform, you acknowledge that you've read and accepted this Policy. If you disagree with any part of it, please refrain from using our services.
                    </p>
                </motion.section>

                {/* Policy Updates Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">2. Policy Updates and Your Acceptance</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We may update this Privacy Policy from time to time to reflect legal, technical, or operational changes. If we make significant updates, we'll notify you, either by posting a notice on our Platform or contacting you directly, where appropriate.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Using the Platform after such updates means you agree to the changes. We encourage you to review this page regularly to stay informed about how we protect your privacy.
                    </p>
                </motion.section>

                {/* Our Services Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">3. Our Services</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind offers tools and infrastructure to help you build, test, and deploy your own algorithmic trading strategies. Please note:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>We do not provide financial advice, stock recommendations, or research reports.</li>
                        <li>The strategies you create and run are entirely your own responsibility.</li>
                        <li>Our services are designed for personal use only and must comply with this Privacy Policy and our Terms of Use.</li>
                    </ul>
                </motion.section>

                {/* Information We Collect Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">4. Information We Collect</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We collect various types of information to offer a seamless and secure experience.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">a. Personal Information</h4>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        We may collect your:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6 ml-4">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Password (encrypted and securely stored)</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We may ask for additional details if required for verification or to provide certain services.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">b. Trading and Account Information</h4>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6 ml-4">
                        <li>We collect details related to your trading activities when you link your brokerage or demat account.</li>
                        <li>We receive trade and order data when your session is active and integrated with your broker.</li>
                        <li>We do not store your broker login credentials, passwords, or one-time passwords (OTPs).</li>
                    </ul>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">c. Technical and Usage Data</h4>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        We automatically collect some information such as:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6 ml-4">
                        <li>IP address</li>
                        <li>Device details</li>
                        <li>Browser type</li>
                        <li>Activity logs and usage patterns</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This helps us improve Platform performance and maintain security.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">d. Content You Share</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Any strategies, analysis, or other content you upload or post on the Platform — including public forums or community spaces — may be visible to others depending on the context.
                    </p>
                </motion.section>

                {/* How We Use Your Information Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">5. How We Use Your Information</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        We use your data for the following purposes:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>To provide and improve our services.</li>
                        <li>To enable the creation, testing, and deployment of your trading strategies.</li>
                        <li>To communicate service updates, notifications, or relevant support information.</li>
                        <li>To ensure Platform security and detect or prevent fraud.</li>
                        <li>To comply with legal or regulatory obligations.</li>
                    </ul>
                </motion.section>

                {/* Keeping Your Data Safe Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">6. Keeping Your Data Safe</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We use modern and industry-standard security practices to safeguard your personal data. These include encryption, secure servers, and restricted access controls.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        However, no online system is entirely risk-free. While we do our best, we cannot guarantee 100% security. We advise you to also take necessary precautions, such as using strong passwords and logging out after your session.
                    </p>
                </motion.section>

                {/* Your Responsibilities Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">7. Your Responsibilities</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        As a user, you are responsible for:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Keeping your account login credentials secure.</li>
                        <li>Notifying us immediately if you suspect any unauthorised access or data breach.</li>
                        <li>Complying with all applicable laws and regulations while using the Platform.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Please understand that you are accountable for all activities carried out using your account.
                    </p>
                </motion.section>

                {/* Data Sharing and Disclosure Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">8. Data Sharing and Disclosure</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We do not sell or rent your personal data to anyone. We may share your information in limited situations:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>With trusted service providers who help us run the Platform (e.g. cloud hosting, analytics), under strict confidentiality agreements.</li>
                        <li>If legally required, to comply with regulations, legal processes, or protect the rights and safety of our users.</li>
                        <li>In case of a merger, acquisition, or restructuring, we'll notify you before your data is transferred or becomes subject to a different privacy policy.</li>
                    </ul>
                </motion.section>

                {/* Integrating with Third Parties Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">9. Integrating with Third Parties</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        To deploy your strategies, you'll need to connect with your broker or demat account provider. Please note:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>We never store your broker login information.</li>
                        <li>We are not responsible for how third-party platforms or brokers handle your data. We encourage you to review their privacy policies before linking your account.</li>
                    </ul>
                </motion.section>

                {/* Ownership and Shared Content Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">10. Ownership and Shared Content</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Any content you create and share on the Platform remains yours, but you are responsible for it. Please ensure that:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>You do not share third-party data without permission.</li>
                        <li>You don't reuse or redistribute content from our Platform without written consent.</li>
                        <li>You do not post offensive, misleading, or infringing material.</li>
                    </ul>
                </motion.section>

                {/* Prohibited Conduct Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">11. Prohibited Conduct</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        To keep our community safe and ethical, you must not:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Use the Platform for illegal or fraudulent activities.</li>
                        <li>Post content that is defamatory, obscene, or violates someone else's rights.</li>
                        <li>Use bots or automated tools without permission.</li>
                        <li>Attempt to access another user's account.</li>
                        <li>Tamper with or disrupt the Platform's functioning or security.</li>
                        <li>Collect data about other users without their consent.</li>
                    </ul>
                </motion.section>

                {/* Cookies and Tracking Technologies Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">12. Cookies and Tracking Technologies</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We use cookies and similar technologies to:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Enhance your user experience</li>
                        <li>Track Platform performance</li>
                        <li>Deliver personalised content</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You can manage cookie preferences through your browser. However, disabling them may limit certain functionalities.
                    </p>
                </motion.section>

                {/* Children's Privacy Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">13. Children's Privacy</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Our services are meant for individuals aged 18 and above. We do not knowingly collect data from minors. If we become aware of any such data, we'll delete it immediately.
                    </p>
                </motion.section>

                {/* Cross-Border Data Transfers Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">14. Cross-Border Data Transfers</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Your information may be stored or processed in countries other than where you live. By using the Platform, you agree to this transfer, provided it complies with applicable laws and maintains adequate protection.
                    </p>
                </motion.section>

                {/* Data Retention Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">15. Data Retention</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We keep your personal data only as long as necessary to:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Provide our services</li>
                        <li>Meet legal and compliance requirements</li>
                        <li>Resolve disputes and enforce agreements</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Once the data is no longer needed, we delete it securely.
                    </p>
                </motion.section>

                {/* Your Rights Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">16. Your Rights</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You have full control over your data. You may:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>View and update your personal information via account settings</li>
                        <li>Request the deletion of your account and associated data</li>
                        <li>Unsubscribe from non-essential communications</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We may retain some data if required by law or for legitimate business reasons.
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
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">17. Limitation of Liability</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        While we take privacy and security seriously, Algo Tradex Mind is not liable for:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Unauthorised access to your data due to factors beyond our control</li>
                        <li>Losses or outcomes from trading strategies you create using the Platform</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        All financial decisions are made at your own discretion and risk.
                    </p>
                </motion.section>

                {/* Indemnity Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">18. Indemnity</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        By using the Platform, you agree to indemnify and hold harmless Algo Tradex Mind and its affiliates against any claims, losses, or liabilities resulting from your misuse of the services or violation of this Policy.
                    </p>
                </motion.section>

                {/* Dispute Resolution Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">19. Dispute Resolution</h3>
                    
                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">a. Initial Resolution</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If you have a dispute or concern, please reach out to us first. We'll attempt to resolve the matter amicably through discussion.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">b. Arbitration</h4>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        If we cannot resolve the issue within 30 days, the matter will be settled through binding arbitration as per the Arbitration and Conciliation Act, 1996.
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>The arbitration will take place in India.</li>
                        <li>Proceedings will be in English and led by a sole arbitrator appointed by both parties.</li>
                        <li>The arbitrator's decision will be final.</li>
                        <li>Costs will be shared equally unless decided otherwise.</li>
                    </ul>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">c. Confidentiality</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        All arbitration-related information will remain confidential unless disclosure is required by law.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">d. Legal Relief</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Either party may approach a court for urgent relief to protect confidential or intellectual property.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">e. Governing Law</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This Policy is governed by Indian law. Subject to arbitration, courts in India have exclusive jurisdiction.
                    </p>
                </motion.section>

                {/* Severability Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">20. Severability</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If any part of this Privacy Policy is found to be invalid or unenforceable, the remaining provisions will still apply and remain in effect.
                    </p>
                </motion.section>

                {/* No Waiver Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">21. No Waiver</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If we choose not to enforce a provision at any point, it doesn't mean we're waiving our rights to do so later.
                    </p>
                </motion.section>

                {/* Assignment Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">22. Assignment</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You may not transfer your rights or obligations under this Policy without our written permission. We may assign our rights as needed.
                    </p>
                </motion.section>

                {/* Entire Agreement Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">23. Entire Agreement</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This Privacy Policy, together with our Terms of Use and Risk Disclosure, forms the complete agreement between you and Algo Tradex Mind. It replaces any previous understandings or agreements.
                    </p>
                </motion.section>

                {/* Risk Disclaimer Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">24. Risk Disclaimer</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algorithmic trading involves substantial risk. Past performance does not guarantee future returns. Please consult a financial advisor before deploying any strategy.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind provides tools, not financial advice. We do not guarantee the accuracy or reliability of simulations or real-time results.
                    </p>
                </motion.section>

                {/* Final Notes Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">25. Final Notes</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We reserve all rights not explicitly granted in this Policy. Our failure to enforce any part of it does not waive our rights to do so in the future.
                    </p>
                </motion.section>

                {/* Contact Us Section */}
                <motion.section
                    className="border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">26. Contact Us</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If you have questions or concerns about this Privacy Policy or how your data is handled, please contact us.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed font-medium">
                        By continuing to use our services, you confirm that you've read, understood, and agreed to this Privacy Policy in full.
                    </p>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicyPage;