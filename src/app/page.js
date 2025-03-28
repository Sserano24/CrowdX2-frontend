"use client"

import Link from "next/link";
import { ShieldCheckIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-16 h-16 text-blue-600" />,
      title: "Secure & Reliable",
      desc: "Smart contracts & Web3 protect your funds and data.",
    },
    {
      icon: <UsersIcon className="w-16 h-16 text-blue-600" />,
      title: "Effortless Collaboration",
      desc: "Connect, manage, and update your supporters easily.",
    },
    {
      icon: <LightBulbIcon className="w-16 h-16 text-blue-600" />,
      title: "Built for Innovation",
      desc: "Designed to help you launch fast and scale smart.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur shadow-md dark:bg-black/80 dark:text-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">CrowdX</h1>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/signup" className="hover:text-blue-600 transition">Sign Up</Link>
          <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-white dark:bg-gray-950">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 dark:text-white leading-tight">Empowering Projects with Secure Crowdfunding</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10">
          Launch your vision with transparency, security, and real-time community engagement.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/campaigns" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition">Explore Campaigns</Link>
          <Link href="/create" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md text-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition">Start a Campaign</Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">Why Choose CrowdX?</h3>
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              {feature.icon}
              <h4 className="text-xl font-semibold text-blue-600">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 text-center bg-blue-50 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">How It Works</h3>
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto text-left">
          {[
            {
              title: "1. Create a Project",
              steps: ["Describe your vision.", "Set goals and payout milestones."],
            },
            {
              title: "2. Connect with Backers",
              steps: ["Build trust with updates.", "Engage with real-time feedback."],
            },
            {
              title: "3. Achieve Your Goals",
              steps: ["Receive funds milestone-by-milestone.", "Deliver results transparently."]
            }
          ].map((step, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h4 className="text-xl font-semibold text-blue-700">{step.title}</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {step.steps.map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CrowdX. Built with transparency in mind.
      </footer>
    </div>
  );
}
