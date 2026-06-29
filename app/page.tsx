// app/page.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { heroData } from '@/data/portfolioData';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import AboutMe from '@/components/AboutMe';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'about'>('home');

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* 🌟 Background Decorative Gradients (ခေတ်မီဆန်းသစ်သော နောက်ခံအရောင်ပြေးများ) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/0 blur-3xl" />
        <div className="absolute top-[60%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-indigo-200/20 to-pink-200/0 blur-3xl" />
      </div>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        
        {/* 📸 Profile Image & Modern Header Section */}
        <div className="flex flex-col items-center text-center pb-6">
          <div className="relative group cursor-pointer">
            {/* Hover လုပ်လျှင် လင်းလာမည့် အပြင်ဘက် Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
            
            <div className="relative w-36 h-36 mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/profile.jpg"
                alt="Profile Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent sm:text-5xl">
            {heroData.name}
          </h1>
          <p className="text-md font-semibold mt-2.5 text-indigo-600 uppercase tracking-wider">
            {heroData.title}
          </p>
        </div>

        {/* 🗂️ Premium Glassmorphism Tab Navigation (မှန်ကြည်ပုံစံ Tab Navigation) */}
        <div className="flex justify-center my-12">
          <nav className="inline-flex p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm" aria-label="Tabs">
            {(['home', 'projects', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-semibold scale-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {tab === 'about' ? 'About Me' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* 🎯 Content Display with Smooth Fade-In Animation */}
        <div className="mt-8 transition-all duration-500 ease-in-out">
          {activeTab === 'home' && (
            <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
              <Hero />
              <Experience />
            </div>
          )}
          
          {activeTab === 'projects' && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <Projects />
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <AboutMe />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}