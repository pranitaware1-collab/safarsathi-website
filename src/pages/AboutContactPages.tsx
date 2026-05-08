import React from 'react';
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
  const [formState, setFormState] = React.useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const API = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.details || data?.error || "Failed to send message");
    }

    setIsSent(true);
    setFormState({ name: "", email: "", message: "" });

    setTimeout(() => setIsSent(false), 5000);
  } catch (err: any) {
    console.error("Contact form error:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">Get in Touch</h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Have questions about a destination or need help planning your trip? Our team is here to help you 24/7.
            </p>

            <div className="space-y-10">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                  <p className="text-gray-600">suyogaware2@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                  <p className="text-gray-600">+91 7972519926</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Our Base</h4>
                  <p className="text-gray-600">Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Your Message</label>
                <textarea 
                  rows={5}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isSent || isLoading}
                className={cn(
                  "w-full py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all shadow-xl",
                  isSent ? "bg-green-500 text-white shadow-green-100" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSent ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
