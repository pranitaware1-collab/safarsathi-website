import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  IndianRupee,
  ArrowLeft,
  Heart,
  Share2,
  Sparkles,
  Link2,
  CheckCircle2,
  Settings,
  X,
  Download,
  FileText
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

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const isFavorite = id ? wishlist.includes(id) : false;

  useEffect(() => {
    const dest = getDestinationById(id || '');
    if (dest) {
      setDestination(dest);
      fetchAI(dest);
      window.scrollTo(0, 0);
    } else {
      navigate('/explore');
    }
  }, [id]);

  const fetchAI = async (dest: Destination) => {
    setIsLoadingAI(true);
    try {
      const recs = await getTravelRecommendations(dest.name);
      setRecommendations(recs);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: destination?.name,
        text: `Check out ${destination?.name}`,
        url: window.location.href,
      });
    } else {
      setIsShareModalOpen(true);
    }
  };

  if (!destination) return null;

  return (
    <div className="pt-16 min-h-screen bg-white">

      {/* HERO */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={destination.image}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 p-3 rounded-full text-white"
        >
          <ArrowLeft />
        </button>

        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-5xl font-black">{destination.name}</h1>

          <div className="flex gap-3 mt-3">
            <span className="bg-indigo-600 px-4 py-1 rounded-full text-xs">
              {destination.category}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">

          {/* PRICE */}
          <div className="p-6 bg-gray-50 rounded-2xl border">
            <h2 className="text-xl font-bold mb-2">Price</h2>
            <p className="text-green-600 text-lg font-bold">
              ₹{destination.price || "Not Available"}
            </p>
          </div>

          {/* ITINERARY */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Trip Schedule</h2>

            {destination.itinerary?.map((day, i) => (
              <div key={i} className="mb-6 bg-white border p-4 rounded-xl">
                <h3 className="font-bold mb-2">Day {day.day}</h3>
                {day.activities.map((a, j) => (
                  <p key={j} className="text-gray-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {a}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* AI */}
          <div className="p-6 bg-indigo-900 text-white rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles /> AI Insights
            </h2>

            {isLoadingAI ? (
              <p>Loading...</p>
            ) : (
              recommendations.map((r, i) => (
                <div key={i} className="mb-4">
                  <h4 className="font-bold">{r.title}</h4>
                  <p className="text-indigo-200 text-sm">{r.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full bg-black text-white py-4 rounded-xl"
          >
            Book Trip
          </button>

          {destination.googleSheetUrl && (
            <a
              href={destination.googleSheetUrl}
              target="_blank"
              className="block text-center bg-green-100 text-green-700 py-3 rounded-xl font-bold"
            >
              Book via Google Sheet
            </a>
          )}

          {destination.itineraryPdfUrl && (
            <a
              href={destination.itineraryPdfUrl}
              target="_blank"
              className="block text-center bg-indigo-100 text-indigo-700 py-3 rounded-xl font-bold"
            >
              Download Itinerary PDF
            </a>
          )}

          {destination.tripPlanUrl && (
            <a
              href={destination.tripPlanUrl}
              target="_blank"
              className="block text-center bg-gray-100 py-3 rounded-xl"
            >
              View Trip Plan
            </a>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        destinationName={destination.name}
        bookingFormUrl={destination.bookingFormUrl}
      />

    </div>
  );
};