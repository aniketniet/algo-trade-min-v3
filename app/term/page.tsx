"use client";

// components/TermsAndConditionsPage.tsx or pages/terms-and-conditions.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion'; // Import Variants type from framer-motion

const TermsAndConditionsPage: React.FC = () => {
    // Animation variants for sections
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

    // Animation variants for the main container
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
                delay: 0.2 // Delay the container animation slightly
            }
        },
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-4 sm:p-6 lg:p-10 min-h-screen flex items-center justify-center">
            <motion.div
                className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12 my-8 border border-blue-200 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out"
                variants={containerVariants}
                initial="hidden"
                animate="visible" // Animate the main container on load
            >
                {/* Header Section */}
                <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 mb-4 text-center tracking-tight leading-tight">
                    Terms and Conditions
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    for Algotradexmind
                </h2>
                <p className="text-base sm:text-lg text-gray-500 mb-10 text-center font-medium">
                    Last updated: May 29, 2025
                </p>
                <p className="text-lg sm:text-xl text-gray-700 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
                    Please read these terms and conditions carefully before using Our Service. Your agreement to these terms is crucial for your continued use of our platform.
                </p>

                {/* Interpretation and Definitions Section */}
                <motion.section
                    className="mb-12 border-t border-b border-blue-100 py-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }} // Animate once when 30% of the section is in view
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Interpretation and Definitions</h3>
                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">Interpretation</h4>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">Definitions</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        For the purposes of these Terms and Conditions:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-8 ml-4">
                        <li><strong className="font-bold text-gray-800">Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                        <li><strong className="font-bold text-gray-800">Country</strong> refers to: Uttar Pradesh, India</li>
                        <li><strong className="font-bold text-gray-800">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Algotradexmind.</li>
                        <li><strong className="font-bold text-gray-800">Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
                        <li><strong className="font-bold text-gray-800">Service</strong> refers to the Website.</li>
                        <li><strong className="font-bold text-gray-800">Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the <a href="https://www.privacypolicyonline.com/terms-conditions-generator/" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">Free Terms and Conditions Generator</a>.</li>
                        <li><strong className="font-bold text-gray-800">Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
                        <li><strong className="font-bold text-gray-800">Website</strong> refers to Algotradexmind, accessible from <a href="https://algotradexmind.com/" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">https://algotradexmind.com/</a></li>
                        <li><strong className="font-bold text-gray-800">You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                    </ul>
                </motion.section>

                {/* Acknowledgment Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Acknowledgment</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                    </p>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                    </p>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
                    </p>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
                    </p>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.
                    </p>
                </motion.section>

                {/* Links to Other Websites Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Links to Other Websites</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
                    </p>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
                    </p>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.
                    </p>
                </motion.section>

                {/* Termination Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Termination</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                    </p>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        Upon termination, Your right to use the Service will cease immediately.
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
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Limitation of Liability</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
                    </p>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
                    </p>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.
                    </p>
                </motion.section>

                {/* "AS IS" and "AS AVAILABLE" Disclaimer Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">"AS IS" and "AS AVAILABLE" Disclaimer</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.
                    </p>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.
                    </p>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.
                    </p>
                </motion.section>

                {/* Governing Law Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Governing Law</h3>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
                    </p>
                </motion.section>

                {/* Disputes Resolution Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Disputes Resolution</h3>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                    </p>
                </motion.section>

                {/* For European Union (EU) Users Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">For European Union (EU) Users</h3>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.
                    </p>
                </motion.section>

                {/* United States Legal Compliance Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">United States Legal Compliance</h3>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
                    </p>
                </motion.section>

                {/* Severability and Waiver Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Severability and Waiver</h3>
                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">Severability</h4>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
                    </p>

                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">Waiver</h4>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
                    </p>
                </motion.section>

                {/* Translation Interpretation Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Translation Interpretation</h3>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.
                    </p>
                </motion.section>

                {/* Changes to These Terms and Conditions Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Changes to These Terms and Conditions</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
                    </p>
                    <p className="text-base text-gray-700 mb-8 leading-relaxed">
                        By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
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
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Contact Us</h3>
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                        If you have any questions about these Terms and Conditions, You can contact us:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-8 ml-4">
                        <li>By phone number: <a href="tel:+919836676300" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200">+91 98366 76300</a></li>
                    </ul>
                    <p className="text-sm text-gray-500 text-center mt-8">
                        Generated using <a href="https://www.privacypolicyonline.com/privacy-policy-generator/" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">Free Privacy Policy Generator</a>
                    </p>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default TermsAndConditionsPage;
