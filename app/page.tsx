// app/page.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { heroData } from '@/data/portfolioData';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import AboutMe from '@/components/AboutMe';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'about'>('home');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* 🔮 Futuristic Background Glowing Orbs (နောက်ခံ လှုပ်ရှားနေသော အလင်းလုံးများ) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" 
        />
      </div>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        
        {/* 📸 Animated Profile & Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center pb-4"
        >
          <div className="relative group cursor-pointer">
            {/* Pulsing Aura Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse" />
            
            <div className="relative w-36 h-36 mb-6 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-900 transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/profile.png"
                alt="Profile Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent sm:text-5xl">
            {heroData.name}
          </h1>
          <p className="text-sm font-bold mt-3 text-indigo-400 uppercase tracking-widest bg-indigo-950/40 px-4 py-1.5 rounded-full border border-indigo-900/50">
            {heroData.title}
          </p>
        </motion.div>

        {/* 🗂️ Premium Dynamic Slider Tabs */}
        <div className="flex justify-center my-12">
          <nav className="inline-flex p-1.5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl relative" aria-label="Tabs">
            {(['home', 'projects', 'about'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-6 py-2.5 text-sm font-medium rounded-xl relative transition-colors duration-300 z-10 ${
                    isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Active ဖြစ်သည့် Tab နောက်ကွယ်မှ ပြေးလိုက်မည့် Indicator Slider Effect */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10 shadow-lg shadow-indigo-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tab === 'about' ? 'About Me' : tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 🎯 Content Display with Intelligent Slide-and-Fade Animations */}
        <div className="mt-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {activeTab === 'home' && (
                <div className="space-y-6">
                  <Hero />
                  <Experience />
                </div>
              )}
              
              {activeTab === 'projects' && <Projects />}
              
              {activeTab === 'about' && <AboutMe />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}