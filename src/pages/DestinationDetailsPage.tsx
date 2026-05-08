import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Star, Calendar, IndianRupee, Hotel, Utensils, 
  ArrowLeft, Heart, Share2, Sparkles, Link2,
  ChevronRight, Info, CheckCircle2, Settings, X, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDestinations } from '@/src/context/DestinationContext';
import { getTravelRecommendations } from '@/src/services/geminiService';
import { Recommendation, Destination } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';

import { BookingModal } from '../components/BookingModal';

export const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, wishlist, toggleWishlist } = useAuth();
  const { getDestinationById } = useDestinations();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const isFavorite = id ? wishlist.includes(id) : false;
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const dest = getDestinationById(id || '');
    if (dest) {
      setDestination(dest);
      window.scrollTo(0, 0);
      // Automatically fetch AI insights on mount since all sections are now active
      fetchAIInsightsForDest(dest);
    } else {
      navigate('/explore');
    }
  }, [id, navigate, getDestinationById]);

  const fetchAIInsightsForDest = async (dest: Destination) => {
    setIsLoadingAI(true);
    try {
      const recs = await getTravelRecommendations(dest.name);
      setRecommendations(recs);
    } catch (error) {
      console.error("AI Fetch Error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      const shareData = {
        title: `Trip to ${destination.name} - SafarSathi`,
        text: `Check out this amazing trip to ${destination.name}! Estimated budget: ${destination.budgetEstimate}. See the full itinerary on SafarSathi.`,
        url: window.location.href,
      };
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out this amazing trip to ${destination?.name}! Estimated budget: ${destination?.budgetEstimate}. See the full itinerary here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!destination) return null;

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-8 left-8 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-8 right-8 z-10 flex space-x-4">
          {(isAdmin || (user?.email === 'pranitaware1@gmail.com' && user?.emailVerified)) && (
            <button 
              onClick={() => navigate('/admin/login')}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all border border-indigo-500 shadow-lg flex items-center space-x-2 px-6"
            >
              <Settings className="w-5 h-5" />
              <span className="font-bold text-sm">Admin Dashboard</span>
            </button>
          )}
          <button 
            onClick={() => id && toggleWishlist(id)}
            className={cn(
              "p-3 backdrop-blur-md rounded-full transition-all border border-white/20",
              isFavorite ? "bg-red-500 text-white border-red-500" : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
          </button>
          <button 
            onClick={handleShare}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/20 relative"
          >
            <Share2 className="w-6 h-6" />
            <AnimatePresence>
              {showShareToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl"
                >
                  Link Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className="absolute bottom-12 left-12 right-12 z-10">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {destination.category}
            </span>
            <div className="flex items-center bg-green-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-green-400 text-xs font-bold border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              ACTIVE STATUS
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">{destination.name}</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center text-white/80 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              <span>India</span>
            </div>
            <p className="text-indigo-400 font-bold italic tracking-wide text-sm md:text-lg">
              "पैसे बँक मे नही यादो मे जमा करो"
            </p>
          </div>
        </div>
      </div>

      {/* Content Navigation - Now as Scroll Links */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'itinerary', label: 'Trip Schedule', icon: Calendar },
              { id: 'ai', label: 'AI Insights', icon: Sparkles }
            ].map(tab => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="flex items-center space-x-2 py-6 text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-600 transition-all"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-24">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-40">
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">About this place</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {destination.longDescription}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Best time to visit</h4>
                        <p className="text-gray-600 text-sm">{destination.bestTimeToVisit}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                        <IndianRupee className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Estimated Budget</h4>
                        <p className="text-gray-600 text-sm">{destination.budgetEstimate} per person</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Nearby Stays & Eats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <Hotel className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-xl font-bold text-gray-900">Hotels</h3>
                      </div>
                      {destination.nearbyHotels.map((hotel, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-all group">
                          <span className="font-medium text-gray-700">{hotel}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <Utensils className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-xl font-bold text-gray-900">Restaurants</h3>
                      </div>
                      {destination.nearbyRestaurants.map((rest, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-all group">
                          <span className="font-medium text-gray-700">{rest}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Itinerary Section */}
            {destination.itinerary && destination.itinerary.length > 0 && (
              <section id="itinerary" className="scroll-mt-40">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Trip Schedule</h2>
                <div className="space-y-8">
                  {destination.itinerary.map((day, idx) => (
                    <div key={idx} className="relative pl-12 pb-12 last:pb-0">
                      {/* Timeline Line */}
                      {idx !== destination.itinerary!.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-indigo-100" />
                      )}
                      
                      {/* Day Circle */}
                      <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 z-10">
                        {day.day}
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          Day {day.day} Plan
                        </h3>
                        <ul className="space-y-4">
                          {day.activities.map((activity, actIdx) => (
                            <li key={actIdx} className="flex items-start space-x-4">
                              <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-gray-600 leading-relaxed">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AI Insights Section */}
            <section id="ai" className="scroll-mt-40">
              <div className="p-10 bg-indigo-900 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-300" />
                    </div>
                    <h2 className="text-3xl font-bold">AI Smart Recommendations</h2>
                  </div>
                  <p className="text-indigo-100 text-lg mb-8 max-w-2xl">
                    Our AI has analyzed thousands of travel experiences to give you the most unique tips for your visit to {destination.name}.
                  </p>
                  
                  {isLoadingAI ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-12 h-12 border-4 border-indigo-400 border-t-white rounded-full animate-spin" />
                      <p className="text-indigo-300 font-medium animate-pulse">Consulting the travel oracle...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {recommendations.map((rec, i) => (
                        <motion.div 
                          key={rec.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                          className="p-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/20 transition-all"
                        >
                          <div className="flex items-start space-x-6">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold mb-2">{rec.title}</h4>
                              <p className="text-indigo-100 leading-relaxed">{rec.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 sticky top-48">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Trip Essentials</h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Location</h4>
                    <p className="text-gray-600 text-sm">{destination.coordinates.lat.toFixed(2)}°N, {destination.coordinates.lng.toFixed(2)}°E</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-200">
                <button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 mb-4"
                >
                  Book This Trip
                </button>
                {destination.itineraryPdfUrl ? (
                  <a 
                    href={destination.itineraryPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`SafarSathi-${destination.name}-Guide.pdf`}
                    className="w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm mb-4"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Guide</span>
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed mb-4"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Guide</span>
                  </button>
                )}

                {destination.tripPlanUrl && (
                  <a 
                    href={destination.tripPlanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 shadow-sm"
                  >
                    <FileText className="w-5 h-5" />
                    <span>View Trip Plan & Schedule</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        destinationName={destination.name}
        bookingFormUrl={destination.bookingFormUrl}
      />

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Trip</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={shareToWhatsApp}
                  className="w-full flex items-center space-x-4 p-4 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-all font-bold"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span>Share on WhatsApp</span>
                </button>

                <button 
                  onClick={copyToClipboard}
                  className="w-full flex items-center space-x-4 p-4 bg-indigo-50 text-indigo-700 rounded-2xl hover:bg-indigo-100 transition-all font-bold"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <span>{showShareToast ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center font-medium">
                  Share this trip with your friends and family to start planning together!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
