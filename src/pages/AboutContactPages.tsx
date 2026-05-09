import React, { useState, useEffect } from 'react';
import { getNotice } from '../services/settingsService';
import { motion } from 'motion/react';
import { Compass, Users, Target, ShieldCheck, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
const API = import.meta.env.VITE_API_URL;

export const AboutPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter uppercase"
          >
            SAFARSATHI TOURISM
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-indigo-600 font-bold italic mb-8 tracking-wide"
          >
            "पैसे बँक मे नही यादो मे जमा करो"
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            We are on a mission to make travel planning smarter, more personalized, and deeply inspiring for everyone.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000" 
                alt="About" 
                className="rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600 rounded-[3rem] -z-10" />
            </div>
            <div className="space-y-12">
              <div>
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Purpose</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  SafarSathi was born from the idea that travel should be more than just visiting places; it should be about meaningful experiences. We leverage AI to help you find the soul of a destination.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Authenticity, sustainability, and accessibility are at the core of everything we do. We believe in responsible tourism that respects local cultures and environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SafarSathi?</h2>
            <p className="text-gray-600">The benefits of traveling with a smart companion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'AI-Powered Insights', desc: 'Get recommendations that go beyond the typical tourist traps.' },
              { title: 'Seamless Planning', desc: 'From budget to itinerary, we handle the complex details for you.' },
              { title: 'Local Expertise', desc: 'Connect with the true essence of every place you visit.' }
            ].map((benefit, i) => (
              <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                  <Compass className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Meet the Team</h2>
            <p className="text-gray-600">The visionaries behind SafarSathi Tourism</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-center group"
            >
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                SA
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Suyog Aware</h4>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-4">Owner & Founder</p>
              <p className="text-gray-600 leading-relaxed">
                Leading the vision of SafarSathi to provide unforgettable travel experiences across India.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-center group"
            >
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                PA
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Pranit Aware</h4>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-4">Website Developer</p>
              <p className="text-gray-600 leading-relaxed">
                Crafting the digital experience of SafarSathi with cutting-edge technology and user-centric design.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ContactPage = () => {
  const [notice, setNotice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotice().then(content => {
      setNotice(content);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-indigo-600 p-1 rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="bg-white p-10 rounded-[2.8rem]">
            <h2 className="text-3xl font-black mb-6 uppercase italic">
              SafarSathi Notice Board
            </h2>

            <div className="text-gray-700 text-lg whitespace-pre-line">
              {isLoading ? (
                <p>Loading updates...</p>
              ) : (
                notice || "Stay tuned for updates!"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};