import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, Trash2, User, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Feedback } from '../types';
import { submitFeedback, subscribeToFeedback, deleteFeedback } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const FeedbackSection = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToFeedback((data) => {
      setFeedbacks(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback form submitted. User:', user?.uid, 'Comment:', comment);
    
    if (!user) {
      console.warn('Feedback submission blocked: No user logged in');
      setError('Please sign in to post feedback.');
      return;
    }
    
    if (!comment.trim()) {
      console.warn('Feedback submission blocked: Empty comment');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      console.log('Calling submitFeedback service...');
      await submitFeedback(rating, comment);
      console.log('submitFeedback service call completed');
      setComment('');
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Feedback submission failed in component:', err);
      try {
        const parsedError = JSON.parse(err.message);
        setError(parsedError.error || 'Failed to submit feedback. Please try again.');
      } catch {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const feedbackToDelete = feedbacks.find(f => f.id === id);
    console.log('Attempting to delete feedback:', {
      id,
      currentUser: user?.uid,
      feedbackOwner: feedbackToDelete?.userId,
      isAdmin
    });
    
    try {
      await deleteFeedback(id);
      console.log('Feedback deleted successfully:', id);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      setError('Failed to delete feedback. You might not have permission.');
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <section id="feedback" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          >
            <MessageSquare className="w-4 h-4" />
            <span>COMMUNITY VOICES</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase"
          >
            What Our <span className="text-indigo-600">SafarSathis</span> Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Real stories from real travelers. Share your experience and help others plan their perfect journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100 sticky top-32"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Thoughts</h3>
              
              {!user ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-6">Please sign in to share your feedback with the community.</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Sign In to Post
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">How was your experience?</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={cn(
                              "w-8 h-8 transition-colors",
                              (hoverRating || rating) >= star 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-200"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Your Message</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your trip, the services, or anything else..."
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] resize-none text-gray-700"
                      required
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium"
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm font-medium"
                    >
                      Thank you! Your feedback has been posted successfully.
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-200 flex items-center justify-center space-x-2 group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Post Feedback</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Loading community voices...</p>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                    <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No feedback yet. Be the first to share!</p>
                  </div>
                ) : (
                  feedbacks.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative group hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            {item.userPhoto ? (
                              <img src={item.userPhoto} alt={item.userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <User className="w-6 h-6 text-indigo-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 leading-tight">{item.userName}</h4>
                            <p className="text-xs text-gray-400 font-medium">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-yellow-400/10 px-3 py-1 rounded-full">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-xs font-black text-yellow-700">{item.rating}.0</span>
                        </div>
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-indigo-50/50 -z-0" />
                        <p className="text-gray-600 leading-relaxed relative z-10 italic">
                          "{item.comment}"
                        </p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          {item.tripName || 'Verified Traveler'}
                        </span>
                        
                        {(isAdmin || (user && user.uid === item.userId)) && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Feedback"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
