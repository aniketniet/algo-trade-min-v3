"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import {
  ArrowRight,
  Bot,
  Zap,
  Shield,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  Star,
  Phone,
  Mail,
  ExternalLink,
  Menu,
  X,
  Play,
  Target,
  Eye,
  Code,
  BarChart,
  Share2,
  PieChart,
  Timer,
  Check,
  MessageSquare,
  Linkedin,
  Youtube,
  Twitter,
  CodeXml,
  Facebook,
  Instagram 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TestSwiper from "@/components/TestSwiper"
import LogoSlider from "@/components/LogoSlider"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const startCount = 0

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * (end - startCount) + startCount))

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Bot className="h-5 w-5 text-white" />
              
            </div> */}
            {/* <span className="text-xl font-bold text-gray-900">Algo Tradex Mind</span> */}
            <img src='/site-logo.png' alt="logo" className="flex items-center pt-5" width={170}/>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "Pricing", "About", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block">
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Free Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
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
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-40 pb-20 sm:pb-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:pr-8"
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
                <Zap className="mr-1 h-3 w-3" />
                Automated Trading Platform
              </Badge>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your Strategy. Our Speed. <span className="text-blue-600">Real Results.</span>
              </h1>

              <p className="mb-8 text-xl text-gray-600 leading-relaxed">
                Automated trading that works while you sleep. Forget delays. Forget guesswork. Just pure algorithmic
                precision on your terms.
              </p>

              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {[
                  { text: "Launch in minutes" },
                  { text: "No code needed" },
                  { text: "Trade automatically, error-free" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                      Start Free Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="px-8 py-4">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: heroY }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src="/images/hero.jpg"
                  alt="Professional trader using Algo Tradex Mind"
                  width={600}
                  height={600}
                  className="rounded-2xl"
                  priority
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Live Trading</div>
                      <div className="text-xs text-gray-600">+₹24,847 today</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">99.7%</div>
                    <div className="text-xs text-gray-600">Execution Accuracy</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Is Algo Tradex Mind Section */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">What Is Algo Tradex Mind?</h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">The Algo Engine That Puts You in Control</p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              Algo Tradex Mind is a smart trading automation platform built for everyday investors and professionals. We
              give you enterprise-grade automation tools, without the tech headache.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {[
              {
                icon: Eye,
                title: "Design strategies visually",
                description: "Build complex logic with simple clicks",
              },
              {
                icon: Timer,
                title: "Run backtests in seconds",
                description: "Test against real historical data",
              },
              {
                icon: Zap,
                title: "Connect to top brokers instantly",
                description: "11+ fully integrated platforms",
              },
              {
                icon: Activity,
                title: "Deploy live, monitor, and adjust",
                description: "Real-time control and optimization",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-4 text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xl text-gray-700 mb-6">Your brain. Our machine. One winning combo.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Try It Now - No payment required
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Key Platform Features */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">Key Platform Features</h2>
          </motion.div>

          <div className="space-y-20">
            {/* Automated Execution */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-2 lg:items-center"
            >
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Automated Execution That Never Blinks</h3>
                <p className="mb-6 text-lg text-gray-600">
                  Your strategy runs exactly as planned, even if you're offline. Zero emotion. Zero delay. Zero noise.
                </p>
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">&lt;200ms Average Execution Delay</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <Activity className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">24/7 Automated Trading Engine</p>
              </div>
            </motion.div>

            {/* Visual Strategy Builder */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-2 lg:items-center"
            >
              <div className="lg:order-2">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Visual Strategy Builder (No Coding)</h3>
                <p className="mb-6 text-lg text-gray-600">
                  Build complex trading logic with simple clicks. If you can think of it, you can automate it.
                </p>
                <div className="flex items-center gap-2 text-green-600">
                  <Code className="h-5 w-5" />
                  <span className="font-semibold">No programming knowledge required</span>
                </div>
              </div>
              <div className="lg:order-1 flex items-center justify-center mx-auto bg-gray-100 w-[640px] h-[200px] rounded-2xl text-center space-y-4 p-4">
                {/* <Image
    src="/images/no-code-builder.png" // <-- Add your own image path
    alt="No-code builder interface"
    width={500}
    height={200}
    className="rounded-2xl"
  /> */}
                <div className="text-center flex flex-col items-center justify-center gap-5">
                  <CodeXml size={80} color="blue" className="text-center" />
                  <span className=" text-gray-600">No-code builder interface</span>
                </div>
              </div>
            </motion.div>

            {/* High-Speed Backtesting */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-2 lg:items-center"
            >
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">High-Speed Backtesting Engine</h3>
                <p className="mb-6 text-lg text-gray-600">
                  Test your ideas against real historical data. Fine-tune your edge with detailed, visual analytics.
                </p>
                <div className="flex items-center gap-2 text-purple-600">
                  <BarChart className="h-5 w-5" />
                  <span className="font-semibold">Years of data processed in seconds</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <BarChart3 className="h-24 w-24 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Advanced Analytics Dashboard</p>
              </div>
            </motion.div>

            {/* Smart Risk Layer */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-2 lg:items-center"
            >
              <div className="lg:order-2">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Smart Risk Layer</h3>
                <p className="mb-6 text-lg text-gray-600">
                  From capital caps to dynamic stop-losses, manage risk like a pro. Of course we need to save capital
                  for the next big moves.
                </p>
                <div className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Advanced risk management controls</span>
                </div>
              </div>
              <div className="lg:order-1 bg-gray-100 rounded-2xl p-8 text-center">
                <Shield className="h-24 w-24 text-red-600 mx-auto mb-4" />
                <p className="text-gray-600">Multi-layer Risk Protection</p>
              </div>
            </motion.div>

            {/* Social Strategy Marketplace */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-2 lg:items-center"
            >
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Social Strategy Marketplace</h3>
                <p className="mb-6 text-lg text-gray-600">
                  Clone high-performing traders. Or publish your own strategies and earn followers.
                </p>
                <div className="flex items-center gap-2 text-orange-600">
                  <Share2 className="h-5 w-5" />
                  <span className="font-semibold">Community-driven strategy sharing</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <Users className="h-24 w-24 text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">Strategy Marketplace</p>
              </div>
            </motion.div>

            {/* Portfolio Mode */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-2 lg:items-center"
            >
              <div className="lg:order-2">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Portfolio Mode</h3>
                <p className="mb-6 text-lg text-gray-600">
                  Mix and match strategies in a custom trading portfolio. See everything in one powerful dashboard.
                </p>
                <div className="flex items-center gap-2 text-indigo-600">
                  <PieChart className="h-5 w-5" />
                  <span className="font-semibold">Unified portfolio management</span>
                </div>
              </div>
              <div className="lg:order-1 bg-gray-100 rounded-2xl p-8 text-center">
                <PieChart className="h-24 w-24 text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600">Portfolio Dashboard</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-4">
            {[
              {
                step: "Step 1",
                title: "Sign Up & Connect Your Broker",
                description: "We support India's leading trading platforms. Start in less than 3 minutes.",
                icon: Zap,
              },
              {
                step: "Step 2",
                title: "Create or Pick a Strategy",
                description: "Use ready-made strategies or build your own with our drag-and-drop wizard.",
                icon: Target,
              },
              {
                step: "Step 3",
                title: "Test It. Break It. Optimise It.",
                description: "Run backtests with precision. See what works. Remove what doesn't.",
                icon: BarChart3,
              },
              {
                step: "Step 4",
                title: "Deploy & Trade Automatically",
                description: "Activate your strategy with live funds. Watch the trades roll in — no clicks required.",
                icon: Play,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mb-2 text-sm font-semibold text-blue-600">{step.step}</div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our Numbers */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Our Numbers Speaks It All</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {[
              { value: 310000, suffix: "+", label: "Trades Executed Per Day", icon: Activity },
              { value: 11, suffix: "+", label: "Fully Integrated Brokers", icon: Zap },
              { value: 99.7, suffix: "%", label: "Execution Accuracy", icon: Target },
              { value: 100, suffix: "K+", label: "Strategies Deployed", icon: BarChart3 },
              { value: 200, suffix: "ms", label: "Average Execution Delay", icon: Timer, prefix: "<" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Brokers */}
      {/* <section className="py-20 sm:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Supported Brokers</h2>
            <p className="text-lg text-gray-600 mb-8">We don't lock you in — we let you choose.</p>
            <p className="text-lg font-semibold text-gray-900">Fully integrated with:</p>
          </motion.div>

          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8">
            {[
              { name: "Zerodha", img: "/logo/logo1.jpeg" },
              { name: "Finvasia", img: "/logo/logo2.PNG" },
              { name: "Angel One", img: "/logo/logo3.png" },
              { name: "Upstox", img: "/logo/logo4.png" },
              { name: "FYERS", img: "/logo/logo5.png" },
              { name: "Dhan", img: "/logo/logo6.png" },
              { name: "IIFL", img: "/logo/logo7.png" },
              { name: "XTS", img: "/logo/logo8.PNG" },
              { name: "Master Trust", img: "/logo/logo9.png" },
              { name: "Master Trust", img: "/logo/logo10.png" },
              // { name: "Master Trust", img: "/logo/logo11.png" },
            ].map((broker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg p-6 text-center shadow-sm border"
              >
                <div className="flex flex-row items-center justify-center gap-3 mb-4">
                  <img
                    src={broker.img}
                    alt={broker.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-lg font-semibold text-gray-900">{broker.name}</span>
                </div>
              </motion.div>
            ))}
          </div>



          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-600">More integrations coming soon.</p>
          </motion.div>
        </div>
      </section> */}

      <LogoSlider/>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Pricing Built for Traders</h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "FREE PLAN",
                price: "₹0",
                period: "/day",
                description: "Ideal for testing the waters",
                features: [
                  { text: "5 Strategy Builds", included: true },
                  { text: "50 Backtests", included: true },
                  { text: "No Live Deployments", included: false },
                  { text: "Reporting Dashboard", included: true },
                ],
                popular: false,
              },
              {
                title: "LIMITED PLAN",
                price: "₹29",
                period: "/day",
                description: "Smart automation for rising traders",
                features: [
                  { text: "25 Strategies", included: true },
                  { text: "500 Backtests", included: true },
                  { text: "Live Deployments: 5", included: true },
                  { text: "Portfolio Mode: 2 strategies", included: true },
                  { text: "Access to Pro Templates", included: true },
                ],
                popular: true,
              },
              {
                title: "UNLIMITED PLAN",
                price: "₹49",
                period: "/day",
                description: "For traders ready to scale",
                features: [
                  { text: "50 Strategies", included: true },
                  { text: "1500 Backtests", included: true },
                  { text: "Live Deployments: 20", included: true },
                  { text: "Portfolio Mode: 10 strategies", included: true },
                  { text: "Strategy Store Access", included: true },
                  { text: "Advanced Risk Control", included: true },
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white rounded-2xl border p-8 shadow-lg ${plan.popular ? "border-blue-200 ring-2 ring-blue-100" : "border-gray-200"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 py-1 text-center text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className={plan.popular ? "pt-4" : ""}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        ) : (
                          <X className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        )}
                        <span className={feature.included ? "text-gray-700" : "text-gray-500 line-through"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                  >
                    {plan.title === "FREE PLAN" ? "Start Free" : "Start Free Trial"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 sm:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Don't Believe Us? Listen to What Our Users Say!
            </h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                quote:
                  "My strategy used to take hours a day to monitor. Algo Tradex Mind runs flawlessly in the background.",
                name: "Nitin Verma",
                role: "Retail Trader",
                image: "/images/trader-1.jpg",
                rating: 5,
              },
              {
                quote: "I cut down my manual work by 90% and improved execution accuracy.",
                name: "Rishabh S.",
                role: "Options Trader",
                image: "/images/trader-2.jpg",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white border-gray-200 h-full shadow-lg">
                  <CardContent className="p-8">
                    <div className="mb-4 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="mb-6 text-gray-700 italic text-lg">"{testimonial.quote}"</blockquote>
                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <TestSwiper/>

      {/* Insights & Articles */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Insights & Articles</h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "What Makes a Strategy Truly Work in 2025?",
                image: "/images/analytics.jpg",
                readTime: "5 min read",
              },
              {
                title: "Retail Algo Trading in India: The Next Wave",
                image: "/images/team-meeting.jpg",
                readTime: "7 min read",
              },
              {
                title: "Psychology vs Automation: Who Wins?",
                image: "/images/office-work.jpg",
                readTime: "6 min read",
              },
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white border-gray-200 overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-500 mb-3">{article.readTime}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{article.title}</h3>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                      Read More
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Visit Blog
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-32 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Talk to a Human</h2>
              <p className="mb-8 text-xl text-blue-100">Questions? Want a live walkthrough? We're always here.</p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hello@algotradexmind.com" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                  { icon: MessageSquare, label: "Live Chat", value: "Available 24/7" },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <contact.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{contact.label}</div>
                      <div className="text-blue-100">{contact.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="bg-white">
                <CardContent className="p-8">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Contact Us</h3>
                  <form className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input placeholder="First Name" className="border-gray-300" />
                      </div>
                      <div>
                        <Input placeholder="Last Name" className="border-gray-300" />
                      </div>
                    </div>
                    <div>
                      <Input type="email" placeholder="Email Address" className="border-gray-300" />
                    </div>
                    <div>
                      <Input placeholder="Phone Number" className="border-gray-300" />
                    </div>
                    <div>
                      <Textarea placeholder="Your Message" rows={4} className="border-gray-300" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-0 flex items-center gap-2"
              >
                {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Bot className="h-5 w-5 text-white" />
                </div> */}
                {/* <span className="text-xl font-bold text-white">Algo Tradex Mind</span> */}
                <img src='/logo-site1.png' alt="logo" className="flex items-center  text-white" width={170}/>
              </motion.div>
              <p className="mb-6 max-w-md text-gray-400">
                Built by Traders. For Traders. India's leading algorithmic trading platform that makes automation
                accessible to everyone.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Youtube, label: "YouTube" },
                  { icon: Twitter, label: "Twitter" },
                  { icon:Facebook , label: "Facebook" },
                  { icon:Instagram  , label: "Instagram" },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <social.icon className="h-5 w-5 text-gray-400 hover:text-white" />
                  </motion.div>
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
                {["Terms of Use", "Privacy Policy", "Refunds", "Disclaimer"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {item}
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
  )
}
