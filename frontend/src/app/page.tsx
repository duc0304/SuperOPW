'use client';

import { useEffect, useRef, useState } from 'react';
import { RiArrowUpLine, RiArrowRightLine } from 'react-icons/ri';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Hiệu ứng parallax cho background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroElement = heroRef.current;
      if (heroElement) {
        heroElement.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }

      // Hiển thị nút scroll to top khi cuộn xuống
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tạo biểu đồ tăng trưởng

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Hero Section với hiệu ứng parallax */}
      <div 
        ref={heroRef} 
        className="relative overflow-hidden bg-[url('/hero-pattern.svg')] bg-no-repeat bg-cover"
        style={{ backgroundSize: '200%' }}
      >
        {/* Background Decoration với hiệu ứng animation */}
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: '40%', y: '-40%' }}
            animate={{ opacity: 0.3, scale: 1, x: '30%', y: '-30%' }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-100/30 rounded-bl-full"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: '-40%', y: '40%' }}
            animate={{ opacity: 0.3, scale: 1, x: '-30%', y: '30%' }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-100/30 rounded-tr-full"
          />
          
          {/* Floating elements */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200/40 rounded-full blur-xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-200/40 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex justify-center relative"
            >
            <Image
              src="/way4.png"
              alt="Way4 Solutions"
              width={400}
              height={200}
                className="object-contain relative drop-shadow-xl"
              priority
            />
            </motion.div>
            
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-6"
            >
              Welcome to Way4 Solutions
            </motion.h1>
            
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
            >
              Streamline your business operations with our comprehensive contract management system. Track, manage, and analyze with confidence.
            </motion.p>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex justify-center gap-6 z-20 relative"
            >
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl z-10 flex items-center"
                >
                  Get Started
                  <RiArrowRightLine className="ml-2 text-xl" />
                </motion.button>
              </Link>
              
              <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-all border border-primary-200 shadow-lg hover:shadow-xl z-10"
                >
                  Dashboard
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Scroll down indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center text-gray-400"
              >
                <span className="text-sm mb-2">Scroll down</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section với hiệu ứng animation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your business contracts efficiently
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Contract Management</h3>
            <p className="text-gray-600 text-center">Efficiently manage and track all your contracts in one centralized platform with automated workflows and reminders.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Analytics & Insights</h3>
            <p className="text-gray-600 text-center">Get valuable insights with real-time analytics and comprehensive reporting to make data-driven decisions.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Customer Management</h3>
            <p className="text-gray-600 text-center">Build and maintain strong relationships with your customers effortlessly with integrated CRM features.</p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section với hiệu ứng counter */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-5xl font-bold text-primary-600 mb-4">10K+</div>
              <div className="text-gray-600 text-lg">Active Users</div>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-5xl font-bold text-primary-600 mb-4">50M+</div>
              <div className="text-gray-600 text-lg">Transactions Processed</div>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-5xl font-bold text-primary-600 mb-4">99.9%</div>
              <div className="text-gray-600 text-lg">System Uptime</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">John Doe</h4>
                <p className="text-sm text-gray-500">CEO, TechCorp</p>
            </div>
            </div>
            <p className="text-gray-600 italic">"Way4 Solutions has transformed how we manage our contracts. The platform is intuitive and has saved us countless hours of administrative work."</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                JS
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Jane Smith</h4>
                <p className="text-sm text-gray-500">CFO, Finance Plus</p>
            </div>
            </div>
            <p className="text-gray-600 italic">"The analytics capabilities are outstanding. We now have clear visibility into our contract performance and can make better financial decisions."</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                RJ
          </div>
              <div className="ml-4">
                <h4 className="font-semibold">Robert Johnson</h4>
                <p className="text-sm text-gray-500">CTO, InnovateTech</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"The integration capabilities are seamless. We've connected Way4 with our existing systems with minimal effort, creating a unified workflow."</p>
          </motion.div>
        </div>
          </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-gradient-to-r from-primary-600 to-indigo-600 py-20 my-16"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of businesses that trust Way4 Solutions for their contract management needs.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/login">
              <button className="px-8 py-4 bg-white text-primary-600 rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all text-lg">
                Get Started Today
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/way4.png"
                alt="Way4 Solutions"
                width={150}
                height={60}
                className="object-contain mb-4"
              />
              <p className="text-gray-400">Streamlining contract management for modern businesses.</p>
                </div>
                <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
                </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
              </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2023 Way4 Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors z-50"
        style={{ display: isVisible ? 'block' : 'none' }}
      >
        <RiArrowUpLine className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
