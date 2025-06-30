'use client'
import React, { useState } from 'react'
import { m, LazyMotion, domAnimation } from "framer-motion"
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight, Menu, X } from 'lucide-react'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <LazyMotion features={domAnimation}>
      <div>
        {/* Navigation */}
        <m.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
        >
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <m.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <img src='/site-logo.png' alt="logo" className="flex items-center pt-5" width={170} />
            </m.div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <m.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </m.a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block">
                Sign In
              </Link>
              <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Start Free Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </m.div>

              {/* Mobile Menu Button */}
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <m.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white border-t border-gray-100 p-4"
            >
              <nav className="flex flex-col gap-4">
                {["Features", "Pricing", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </m.div>
          )}
        </m.header>
      </div>
    </LazyMotion>
  )
}

export default Header