"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const RefundPolicyPage: React.FC = () => {
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
                    Refund Policy
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    Algo Tradex Mind
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
                    Please read this Refund Policy carefully before subscribing to our services.
                </p>

                {/* Nature of Services Section */}
                <motion.section
                    className="mb-12"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">1. Nature of Services (Digital & Non-Tangible)</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind provides software tools and infrastructure for individuals to build, test, and deploy algorithmic trading strategies. These services are offered digitally, on a subscription basis, and access is typically granted immediately upon successful payment.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        As there are no physical products or deliveries, and the service is consumed as soon as it is accessed, all purchases are considered final, except where explicitly stated otherwise in this policy.
                    </p>
                </motion.section>

                {/* General Refund Policy Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">2. General Refund Policy</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We do not offer refunds under the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Change of mind after purchase.</li>
                        <li>Accidental subscription or duplicate sign-up by the user.</li>
                        <li>Dissatisfaction with trading results (which are dependent on user-created strategies, not Algo Tradex Mind).</li>
                        <li>Misunderstanding of the service or its features, where such information was publicly available before purchase.</li>
                        <li>Failure to cancel an auto-renewing subscription on time.</li>
                        <li>Suspension or termination of account due to breach of our Terms of Use or other policies.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We strongly advise all users to thoroughly review the nature of our services before subscribing. If you have questions before making a payment, we're happy to assist.
                    </p>
                </motion.section>

                {/* Refunds Only for Verified Technical Failures Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">3. Refunds Only for Verified Technical Failures</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        A refund may be considered (entirely at our discretion) only if:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>The user is completely unable to access the Platform or critical features due to a fault that originates from Algo Tradex Mind.</li>
                        <li>Our team is unable to resolve the issue within a reasonable period (typically within 5–7 working days) after you report it in writing.</li>
                        <li>You submit your request for refund within 7 calendar days of the issue occurring and provide sufficient details (including screenshots, error logs, and device/browser details).</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Please note: Refunds will not be processed for issues caused by third-party services (e.g. brokerage platform outages, incorrect API configurations, or internet/network issues at your end).
                    </p>
                </motion.section>

                {/* Billing Errors Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">4. Billing Errors and Duplicate Charges</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If you believe you've been wrongly charged or billed more than once:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Please reach out to our billing team within 5 days of the charge.</li>
                        <li>If verified, the duplicate charge will be reversed within 7–10 business days, through the original mode of payment.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We encourage users to review their subscription invoices regularly to avoid unnoticed billing issues.
                    </p>
                </motion.section>

                {/* Subscription Renewals Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">5. Subscription Renewals and Cancellations</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Our subscriptions are automatically renewed at the end of each billing cycle (monthly, quarterly, or yearly).
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>You may cancel your subscription at any time via your account dashboard.</li>
                        <li>To avoid being charged for the next cycle, cancellation must be done at least 24 hours before the renewal date.</li>
                        <li>We do not provide partial refunds for unused time after cancellation. Your access will remain valid until the end of your billing period.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        It is solely the user's responsibility to manage and cancel subscriptions in a timely manner.
                    </p>
                </motion.section>

                {/* No Refunds on Trading Outcomes Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">6. No Refunds on Trading Outcomes</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Algo Tradex Mind is a platform that supports you in building and running your own algorithmic strategies. We do not:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>Offer investment advice or financial recommendations,</li>
                        <li>Guarantee the accuracy, performance, or profitability of any strategy or output, or</li>
                        <li>Take responsibility for gains, losses, or decisions made based on strategy performance.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        You are solely responsible for the design, deployment, and outcomes of your strategies. Under no condition will refunds be issued based on trading losses or dissatisfaction with performance.
                    </p>
                </motion.section>

                {/* Special Offers Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">7. Special or Promotional Offers</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Payments made under special pricing (e.g. discounts, coupons, seasonal offers, or limited-time promotions) are non-refundable unless explicitly stated in the offer terms.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If a refund is granted in rare cases, it will reflect only the amount actually paid, not the full standard price.
                    </p>
                </motion.section>

                {/* Discretionary Refunds Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">8. Discretionary Refunds</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        In rare and genuine cases not covered above, we may issue a refund at our absolute discretion. This should not be considered a waiver of our general policy and does not guarantee similar treatment in future cases.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We will review such requests on a case-by-case basis. Our decision will be final and binding.
                    </p>
                </motion.section>

                {/* How Refunds Are Processed Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">9. How Refunds Are Processed</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        If a refund is approved:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>It will be issued only to the original payment method used during the transaction.</li>
                        <li>Processing times may vary depending on your bank or payment service provider, but typically range between 7 to 10 business days.</li>
                        <li>We are not responsible for any delays caused by the payment gateway or financial institutions.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We do not issue refunds in cash, cheques, or to alternate accounts.
                    </p>
                </motion.section>

                {/* Legal Standing Section */}
                <motion.section
                    className="mb-12 border-t border-blue-100 pt-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">10. Legal Standing and Liability</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        This Refund Policy is governed by the laws of India. By using our Platform, you agree that:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-700 space-y-3 mb-6 ml-4">
                        <li>You understand the services are digital and custom-use in nature.</li>
                        <li>Algo Tradex Mind makes no guarantees of financial return.</li>
                        <li>Refunds are only considered in line with this clearly defined policy.</li>
                        <li>Our liability is strictly limited to the value of the subscription fee paid and does not extend to indirect or consequential losses.</li>
                    </ul>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Any misuse of the refund process, false claims, or chargebacks without valid cause may result in account suspension or legal action.
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
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">12. Final Note</h3>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        We believe in transparency and fairness. However, we also need to protect the integrity of our service and business model. This Refund Policy is in place to ensure clarity for both parties and avoid misuse.
                    </p>
                    <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        Please read this policy in full before subscribing. If you have any questions, feel free to contact us.
                    </p>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default RefundPolicyPage;