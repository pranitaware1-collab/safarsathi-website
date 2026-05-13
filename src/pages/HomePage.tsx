
import { Search, MapPin, Star, ArrowRight, Compass, Mountain, Waves, Landmark, Building2, Church, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDestinations } from '@/src/context/DestinationContext';
import { CATEGORIES } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';
import { FeedbackSection } from '../components/FeedbackSection';
import React, { useState, useEffect } from 'react';


const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Beaches': return <Waves className="w-6 h-6" />;
    case 'Mountains': return <Mountain className="w-6 h-6" />;
    case 'Historical Places': return <Landmark className="w-6 h-6" />;
    case 'Cities': return <Building2 className="w-6 h-6" />;
    case 'Religious Places': return <Church className="w-6 h-6" />;
    default: return <Compass className="w-6 h-6" />;
  }
};

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { destinations } = useDestinations();
  const { user } = useAuth();
  const navigate = useNavigate();
 



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularDestinations = destinations.slice(0, 3);
   const fullText = "SAFARSATHI TOURISM";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {

    let index = 0;

    const interval = setInterval(() => {

      setDisplayText(
        fullText.slice(0, index)
      );

      index++;

      if (index > fullText.length) {
        index = 0;
      }

    }, 150);

    return () => clearInterval(interval);

  }, []);


  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=60&w=1200&fm=webp" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-white text-sm font-bold tracking-wider uppercase">
                Welcome back, {user.displayName || user.email?.split('@')[0]}!
              </span>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex justify-center"
          >
            <img 
              src="/logo.jpg" 
              alt="SafarSathi Logo" 
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/30 shadow-2xl backdrop-blur-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
       <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter uppercase"
>
  {displayText}
  <span className="animate-pulse">|</span>
</motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center mb-12"
          >
            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-sm md:text-lg mb-4">Tourism</span>
            <p className="text-xl md:text-2xl text-white/90 font-medium italic tracking-wide">
              "पैसे बँक मे नही यादो मे जमा करो"
            </p>
          </motion.div>
           <motion.img
  src="/traveler.png"
  alt="Traveler"
  animate={{
    x: [0, 40, 0]
  }}
  transition={{
    duration: 6,
    repeat: Infinity
  }}
  className="
    w-24
    md:w-36
    mx-auto
    mb-6
    drop-shadow-2xl
  "
/>


          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-6 text-gray-400 w-6 h-6 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Where do you want to go?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-32 py-6 rounded-2xl bg-white/95 backdrop-blur-md border-none shadow-2xl focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-400 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-3 bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600">Find the perfect destination based on your travel style</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => navigate(`/explore?category=${category}`)}
              >
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center space-y-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-100">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <CategoryIcon category={category} />
                  </div>
                  <span className="font-semibold text-sm text-center">{category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
              <p className="text-gray-600">Handpicked places for your next adventure</p>
            </div>
            <Link to="/explore" className="flex items-center text-indigo-600 font-semibold hover:translate-x-2 transition-transform">
              View All <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                    <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider w-fit">
                      {dest.category}
                    </span>
                    <div className="bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter w-fit flex items-center shadow-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                      Active
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>India</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{dest.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider mb-1">Est. Budget</span>
                      <span className="text-lg font-bold text-indigo-600">{dest.budgetEstimate}</span>
                    </div>
                    <Link 
                      to={`/destination/${dest.id}`}
                      className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Features Preview */}
      <section className="py-24 bg-indigo-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8 leading-tight">Smart Features for Smarter Travel</h2>
              <div className="space-y-8">
                {[
                  { title: 'AI Recommendations', desc: 'Get personalized travel tips powered by advanced AI.' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-indigo-200 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-indigo-800/50 backdrop-blur-xl border border-indigo-700/50 p-8 flex flex-col justify-center items-center text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to start?</h3>
                <p className="text-indigo-200 mb-8 max-w-xs">Join thousands of travelers who use SafarSathi to plan their dream trips.</p>
                <Link to="/explore" className="bg-white text-indigo-900 px-10 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl">
                  Explore Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FeedbackSection />
    </div>
  );
};
