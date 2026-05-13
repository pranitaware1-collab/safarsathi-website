import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Filter, 
  X,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDestinations } from '@/src/context/DestinationContext';
import { CATEGORIES } from '@/src/constants';
import { cn } from '@/src/lib/utils';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { destinations } = useDestinations();
  const { wishlist, toggleWishlist } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
 const [selectedCategory, setSelectedCategory] = useState(
  searchParams.get('category') || 'All'
);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const filteredDestinations = useMemo(() => {
  return destinations.filter(dest => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      dest.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}, [searchQuery, selectedCategory, destinations]);
const handleCategorySelect = (category: string) => {
  setSelectedCategory(category);
  searchParams.set('category', category);
  setSearchParams(searchParams);
};

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Explore Destinations</h1>
            <p className="text-indigo-600 font-bold italic tracking-wide">"पैसे बँक मे नही यादो मे जमा करो"</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "p-3 rounded-xl border transition-all flex items-center gap-2 font-medium",
                isFilterOpen ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-indigo-600"
              )}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Categories Filter Bar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="flex flex-wrap gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <button
                 onClick={() => handleCategorySelect('All')}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                    !selectedCategory ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  All
                </button>
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                      selectedCategory === category ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                  
              src={dest.image}
              alt={dest.name}
              

                 onError={(e) => {

               console.log(
               "FAILED IMAGE:",
              dest.image
                 );

                e.currentTarget.src =
                "https://via.placeholder.com/400x300?text=Image+Not+Found";
                   }}

                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search or category filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-8 text-indigo-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
