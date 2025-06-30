'use client'
import Link from 'next/link'
import React from 'react'
import { m, LazyMotion, domAnimation } from "framer-motion"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div>
        {/* Footer */}
        <footer className="bg-gray-900 py-16 text-gray-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-0 flex items-center gap-2"
                >
                  <img src='/logo-site1.png' alt="logo" className="flex items-center text-white" width={170} />
                </m.div>
                <p className="mb-6 max-w-md text-gray-400">
                  Built by Traders. For Traders. India's leading algorithmic trading platform that makes automation
                  accessible to everyone.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: Linkedin, label: "LinkedIn" },
                    { icon: Youtube, label: "YouTube" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: Facebook, label: "Facebook" },
                    { icon: Instagram, label: "Instagram" },
                  ].map((social, index) => (
                    <m.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <social.icon className="h-5 w-5 text-gray-400 hover:text-white" />
                    </m.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Pages</h3>
                <ul className="space-y-3">
                  {["Home", "Features", "Pricing", "Contact", "Blog", "Legal"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Docs</h3>
                <ul className="space-y-3">
                  {[
                    { label: "Terms of Use", path: "/term" },
                    { label: "Privacy Policy", path: "/policy" },
                    { label: "Refunds", path: "/refund" },
                    { label: "Disclaimer", path: "/disclaimer" },
                  ].map(({ label, path }) => (
                    <li key={label}>
                      <Link href={path} className="hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Connect</h3>
                <ul className="space-y-3">
                  {["LinkedIn", "YouTube", "Twitter"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-800 pt-8">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-gray-500">© 2025 Algo Tradex Mind. Built by Traders. For Traders.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  )
}

export default Footer