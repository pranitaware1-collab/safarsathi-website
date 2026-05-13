import React from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Star, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../context/DestinationContext';

export const WishlistPage = () => {

const { wishlist, user } = useAuth();


  const { destinations } = useDestinations();

  
const favoriteDestinations =
  destinations.filter(
    d => d.id && wishlist.includes(d.id)
  );

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Please login to view and manage your favorite travel destinations.
        </p>
        <Link 
          to="/" 
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <span className="text-red-500 font-bold tracking-widest uppercase text-sm">My Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">YOUR WISHLIST</h1>
          </div>
          <p className="text-gray-500 font-medium max-w-xs">
            You have {favoriteDestinations.length} destinations saved in your wishlist.
          </p>
        </div>

        {favoriteDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
              >
                <Link to={`/destination/${dest.id}`} className="block relative h-72 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-2 text-white/90 text-xs font-bold uppercase tracking-widest mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{dest.category}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{dest.name}</h3>
                  </div>
                </Link>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-indigo-600 font-black text-lg">
                      {dest.budgetEstimate}
                    </div>
                  </div>
                  <Link 
                    to={`/destination/${dest.id}`}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all group/btn"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600">
              <Compass className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto">
              Start exploring beautiful destinations and save them to your wishlist to plan your next adventure.
            </p>
            <Link 
              to="/explore" 
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
