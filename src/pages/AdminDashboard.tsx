import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, LayoutDashboard, 
  LogOut, Image as ImageIcon, IndianRupee, 
  MapPin, Star, Save, X, Search, FileText,
  Hotel, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../context/DestinationContext';
import { Destination } from '../types';
import { cn } from '../lib/utils';

export const AdminDashboard = () => {
  const { isAdmin, logout, clearAdmin } = useAuth();
  const { destinations, addDestination, updateDestination, deleteDestination } = useDestinations();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthorized = isAdmin || location.state?.authorized;

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Destination>>({});
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (!isAuthorized) {
      // Use a microtask or timeout to ensure navigation happens after the current render cycle
      const timeoutId = setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthorized, navigate]);

  if (!isAuthorized) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEdit = (dest: Destination) => {
    setIsEditing(dest.id);
    setIsAdding(false);
    setEditForm(dest);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setIsEditing(null);
    setEditForm({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category: 'Cities',
      image: 'https://picsum.photos/seed/new/1200/800',
      description: '',
      longDescription: '',
      budgetEstimate: '₹0',
      bestTimeToVisit: '',
      nearbyHotels: [],
      nearbyRestaurants: [],
      coordinates: { lat: 0, lng: 0 },
      itinerary: [],
      itineraryPdfUrl: '',
      tripPlanUrl: '',
      bookingFormUrl: ''
    });
  };

  const handleSave = () => {
    const finalForm = { ...editForm };
    
    // Auto-convert Google Drive view links to direct download links
    if (finalForm.itineraryPdfUrl && finalForm.itineraryPdfUrl.includes('drive.google.com')) {
      const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)\/view/;
      const match = finalForm.itineraryPdfUrl.match(driveRegex);
      if (match && match[1]) {
        finalForm.itineraryPdfUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    if (finalForm.tripPlanUrl && finalForm.tripPlanUrl.includes('drive.google.com')) {
      const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)\/view/;
      const match = finalForm.tripPlanUrl.match(driveRegex);
      if (match && match[1]) {
        finalForm.tripPlanUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    if (isEditing) {
      updateDestination(isEditing, finalForm);
      setIsEditing(null);
    } else if (isAdding) {
      addDestination(finalForm as Destination);
      setIsAdding(false);
    }
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteDestination(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-4 group">
            <div className="flex flex-col">
              <span className="text-lg font-black text-gray-900 tracking-tighter leading-none uppercase">Admin Panel</span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">SafarSathi</span>
            </div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Logged in as</p>
            <p className="text-sm font-bold text-indigo-900">Suyog Aware</p>
          </div>
        </div>
        
        <div className="flex-grow p-6 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span>Destinations</span>
          </button>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
          
          <div className="mt-8 pt-6 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Developer</p>
            <p className="text-xs font-bold text-gray-900">Pranit Aware</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Manage Trips</h1>
              <p className="text-indigo-600 font-bold italic tracking-wide text-sm">"पैसे बँक मे नही यादो मे जमा करो"</p>
            </div>
            <button 
              onClick={handleAddNew}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Trip</span>
            </button>
          </div>

          {/* Add New Trip Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 rounded-[2rem] border border-indigo-100 shadow-xl mb-12"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Trip</h2>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Destination Name</label>
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="e.g. Goa, India"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                      <select 
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value as any})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="Beaches">Beaches</option>
                        <option value="Mountains">Mountains</option>
                        <option value="Historical Places">Historical Places</option>
                        <option value="Cities">Cities</option>
                        <option value="Religious Places">Religious Places</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Price Estimate (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                          type="text" 
                          value={editForm.budgetEstimate}
                          onChange={(e) => setEditForm({...editForm, budgetEstimate: e.target.value})}
                          placeholder="₹10,000 - ₹20,000"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Best Time to Visit</label>
                      <input 
                        type="text" 
                        value={editForm.bestTimeToVisit}
                        onChange={(e) => setEditForm({...editForm, bestTimeToVisit: e.target.value})}
                        placeholder="e.g. Nov to Feb"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Latitude</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={editForm.coordinates?.lat}
                        onChange={(e) => setEditForm({...editForm, coordinates: { ...editForm.coordinates!, lat: parseFloat(e.target.value) }})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Longitude</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={editForm.coordinates?.lng}
                        onChange={(e) => setEditForm({...editForm, coordinates: { ...editForm.coordinates!, lng: parseFloat(e.target.value) }})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        value={editForm.image}
                        onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">Tip: Use Unsplash or any image URL. Ensure it ends in .jpg or .png</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Itinerary PDF Link</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        value={editForm.itineraryPdfUrl}
                        onChange={(e) => setEditForm({...editForm, itineraryPdfUrl: e.target.value})}
                        placeholder="Link to itinerary PDF (e.g. Google Drive, Dropbox, etc.)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">Tip: Google Drive "Share" links are automatically converted to direct downloads.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Trip Plan/Schedule Link (Google Drive)</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        value={editForm.tripPlanUrl}
                        onChange={(e) => setEditForm({...editForm, tripPlanUrl: e.target.value})}
                        placeholder="Link to Trip Plan (Train schedule, dates, etc.)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Google Booking Sheet Link</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        value={editForm.bookingFormUrl}
                        onChange={(e) => setEditForm({...editForm, bookingFormUrl: e.target.value})}
                        placeholder="Link to Google Sheet for this trip"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">Tip: Each trip can have its own separate Google Sheet.</p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1">Automation Tip</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      To automatically send confirmation emails and WhatsApp messages after a user fills your Google Sheet, you can use <b>Google Apps Script</b> or tools like <b>Zapier/Make</b>. The "Confirm on WhatsApp" button in the app is a manual fallback for users.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Short Description</label>
                    <textarea 
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="A brief summary of the destination..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Long Description</label>
                    <textarea 
                      value={editForm.longDescription}
                      onChange={(e) => setEditForm({...editForm, longDescription: e.target.value})}
                      placeholder="Detailed description of the destination..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                    />
                  </div>

                  {/* Nearby Stays & Eats Management */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center">
                          <Hotel className="w-3 h-3 mr-1" /> Nearby Stays (Hotels)
                        </label>
                        <button 
                          onClick={() => {
                            const newHotels = [...(editForm.nearbyHotels || [])];
                            newHotels.push('');
                            setEditForm({ ...editForm, nearbyHotels: newHotels });
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                        >
                          + Add Hotel
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(editForm.nearbyHotels || []).map((hotel, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              value={hotel}
                              onChange={(e) => {
                                const newHotels = [...(editForm.nearbyHotels || [])];
                                newHotels[idx] = e.target.value;
                                setEditForm({ ...editForm, nearbyHotels: newHotels });
                              }}
                              placeholder="Hotel name"
                              className="flex-grow px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button 
                              onClick={() => {
                                const newHotels = (editForm.nearbyHotels || []).filter((_, i) => i !== idx);
                                setEditForm({ ...editForm, nearbyHotels: newHotels });
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center">
                          <Utensils className="w-3 h-3 mr-1" /> Nearby Eats (Restaurants)
                        </label>
                        <button 
                          onClick={() => {
                            const newEats = [...(editForm.nearbyRestaurants || [])];
                            newEats.push('');
                            setEditForm({ ...editForm, nearbyRestaurants: newEats });
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                        >
                          + Add Restaurant
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(editForm.nearbyRestaurants || []).map((rest, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              value={rest}
                              onChange={(e) => {
                                const newEats = [...(editForm.nearbyRestaurants || [])];
                                newEats[idx] = e.target.value;
                                setEditForm({ ...editForm, nearbyRestaurants: newEats });
                              }}
                              placeholder="Restaurant name"
                              className="flex-grow px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button 
                              onClick={() => {
                                const newEats = (editForm.nearbyRestaurants || []).filter((_, i) => i !== idx);
                                setEditForm({ ...editForm, nearbyRestaurants: newEats });
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Itinerary Management (Reuse the same logic) */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Trip Schedule (Itinerary)</label>
                      <button 
                        onClick={() => {
                          const newItinerary = [...(editForm.itinerary || [])];
                          newItinerary.push({ day: newItinerary.length + 1, activities: [''] });
                          setEditForm({ ...editForm, itinerary: newItinerary });
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Day</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(editForm.itinerary || []).map((day, dayIdx) => (
                        <div key={dayIdx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700">Day {day.day}</span>
                            <button 
                              onClick={() => {
                                const newItinerary = (editForm.itinerary || []).filter((_, i) => i !== dayIdx)
                                  .map((d, i) => ({ ...d, day: i + 1 }));
                                setEditForm({ ...editForm, itinerary: newItinerary });
                              }}
                              className="text-xs text-red-500 hover:text-red-600 font-bold"
                            >
                              Remove Day
                            </button>
                          </div>
                          <div className="space-y-2">
                            {day.activities.map((activity, actIdx) => (
                              <div key={actIdx} className="flex items-center space-x-2">
                                <input 
                                  type="text" 
                                  value={activity}
                                  onChange={(e) => {
                                    const newItinerary = [...(editForm.itinerary || [])];
                                    newItinerary[dayIdx].activities[actIdx] = e.target.value;
                                    setEditForm({ ...editForm, itinerary: newItinerary });
                                  }}
                                  placeholder={`Activity ${actIdx + 1}`}
                                  className="flex-grow px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <button 
                                  onClick={() => {
                                    const newItinerary = [...(editForm.itinerary || [])];
                                    newItinerary[dayIdx].activities = newItinerary[dayIdx].activities.filter((_, i) => i !== actIdx);
                                    setEditForm({ ...editForm, itinerary: newItinerary });
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newItinerary = [...(editForm.itinerary || [])];
                                newItinerary[dayIdx].activities.push('');
                                setEditForm({ ...editForm, itinerary: newItinerary });
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mt-2"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Activity</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button 
                      onClick={handleSave}
                      className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      <Save className="w-5 h-5" />
                      <span>Create Trip</span>
                    </button>
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="bg-gray-100 text-gray-600 px-10 py-4 rounded-xl font-bold flex items-center space-x-2 hover:bg-gray-200 transition-all"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Destinations List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredDestinations.map((dest) => (
              <motion.div 
                key={dest.id}
                layout
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                {isEditing === dest.id ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Destination Name</label>
                        <input 
                          type="text" 
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                        <select 
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value as any})}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="Beaches">Beaches</option>
                          <option value="Mountains">Mountains</option>
                          <option value="Historical Places">Historical Places</option>
                          <option value="Cities">Cities</option>
                          <option value="Religious Places">Religious Places</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Price Estimate (₹)</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input 
                            type="text" 
                            value={editForm.budgetEstimate}
                            onChange={(e) => setEditForm({...editForm, budgetEstimate: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Best Time to Visit</label>
                        <input 
                          type="text" 
                          value={editForm.bestTimeToVisit}
                          onChange={(e) => setEditForm({...editForm, bestTimeToVisit: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Latitude</label>
                        <input 
                          type="number" 
                          step="0.0001"
                          value={editForm.coordinates?.lat}
                          onChange={(e) => setEditForm({...editForm, coordinates: { ...editForm.coordinates!, lat: parseFloat(e.target.value) }})}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Longitude</label>
                        <input 
                          type="number" 
                          step="0.0001"
                          value={editForm.coordinates?.lng}
                          onChange={(e) => setEditForm({...editForm, coordinates: { ...editForm.coordinates!, lng: parseFloat(e.target.value) }})}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Image URL</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                          type="text" 
                          value={editForm.image}
                          onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-1">Tip: Use Unsplash or any image URL. Ensure it ends in .jpg or .png</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Short Description</label>
                      <textarea 
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Long Description</label>
                      <textarea 
                        value={editForm.longDescription}
                        onChange={(e) => setEditForm({...editForm, longDescription: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Itinerary PDF Link</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                          type="text" 
                          value={editForm.itineraryPdfUrl}
                          onChange={(e) => setEditForm({...editForm, itineraryPdfUrl: e.target.value})}
                          placeholder="Link to itinerary PDF"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-1">Tip: Google Drive "Share" links are automatically converted to direct downloads.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Trip Plan/Schedule Link</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                          type="text" 
                          value={editForm.tripPlanUrl}
                          onChange={(e) => setEditForm({...editForm, tripPlanUrl: e.target.value})}
                          placeholder="Link to Trip Plan"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Google Booking Sheet Link</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                          type="text" 
                          value={editForm.bookingFormUrl}
                          onChange={(e) => setEditForm({...editForm, bookingFormUrl: e.target.value})}
                          placeholder="Link to Google Sheet"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Nearby Stays & Eats Management */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center">
                            <Hotel className="w-3 h-3 mr-1" /> Nearby Stays (Hotels)
                          </label>
                          <button 
                            onClick={() => {
                              const newHotels = [...(editForm.nearbyHotels || [])];
                              newHotels.push('');
                              setEditForm({ ...editForm, nearbyHotels: newHotels });
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                          >
                            + Add Hotel
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(editForm.nearbyHotels || []).map((hotel, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input 
                                type="text" 
                                value={hotel}
                                onChange={(e) => {
                                  const newHotels = [...(editForm.nearbyHotels || [])];
                                  newHotels[idx] = e.target.value;
                                  setEditForm({ ...editForm, nearbyHotels: newHotels });
                                }}
                                placeholder="Hotel name"
                                className="flex-grow px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                              <button 
                                onClick={() => {
                                  const newHotels = (editForm.nearbyHotels || []).filter((_, i) => i !== idx);
                                  setEditForm({ ...editForm, nearbyHotels: newHotels });
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center">
                            <Utensils className="w-3 h-3 mr-1" /> Nearby Eats (Restaurants)
                          </label>
                          <button 
                            onClick={() => {
                              const newEats = [...(editForm.nearbyRestaurants || [])];
                              newEats.push('');
                              setEditForm({ ...editForm, nearbyRestaurants: newEats });
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                          >
                            + Add Restaurant
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(editForm.nearbyRestaurants || []).map((rest, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input 
                                type="text" 
                                value={rest}
                                onChange={(e) => {
                                  const newEats = [...(editForm.nearbyRestaurants || [])];
                                  newEats[idx] = e.target.value;
                                  setEditForm({ ...editForm, nearbyRestaurants: newEats });
                                }}
                                placeholder="Restaurant name"
                                className="flex-grow px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                              <button 
                                onClick={() => {
                                  const newEats = (editForm.nearbyRestaurants || []).filter((_, i) => i !== idx);
                                  setEditForm({ ...editForm, nearbyRestaurants: newEats });
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Itinerary Management */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Trip Schedule (Itinerary)</label>
                        <button 
                          onClick={() => {
                            const newItinerary = [...(editForm.itinerary || [])];
                            newItinerary.push({ day: newItinerary.length + 1, activities: [''] });
                            setEditForm({ ...editForm, itinerary: newItinerary });
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Day</span>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {(editForm.itinerary || []).map((day, dayIdx) => (
                          <div key={dayIdx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-700">Day {day.day}</span>
                              <button 
                                onClick={() => {
                                  const newItinerary = (editForm.itinerary || []).filter((_, i) => i !== dayIdx)
                                    .map((d, i) => ({ ...d, day: i + 1 }));
                                  setEditForm({ ...editForm, itinerary: newItinerary });
                                }}
                                className="text-xs text-red-500 hover:text-red-600 font-bold"
                              >
                                Remove Day
                              </button>
                            </div>
                            <div className="space-y-2">
                              {day.activities.map((activity, actIdx) => (
                                <div key={actIdx} className="flex items-center space-x-2">
                                  <input 
                                    type="text" 
                                    value={activity}
                                    onChange={(e) => {
                                      const newItinerary = [...(editForm.itinerary || [])];
                                      newItinerary[dayIdx].activities[actIdx] = e.target.value;
                                      setEditForm({ ...editForm, itinerary: newItinerary });
                                    }}
                                    placeholder={`Activity ${actIdx + 1}`}
                                    className="flex-grow px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                  />
                                  <button 
                                    onClick={() => {
                                      const newItinerary = [...(editForm.itinerary || [])];
                                      newItinerary[dayIdx].activities = newItinerary[dayIdx].activities.filter((_, i) => i !== actIdx);
                                      setEditForm({ ...editForm, itinerary: newItinerary });
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => {
                                  const newItinerary = [...(editForm.itinerary || [])];
                                  newItinerary[dayIdx].activities.push('');
                                  setEditForm({ ...editForm, itinerary: newItinerary });
                                }}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mt-2"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Activity</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button 
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button 
                        onClick={() => setIsEditing(null)}
                        className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-gray-200 transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <IndianRupee className="w-3 h-3 mr-1" />
                            <span>{dest.budgetEstimate}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>India</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(dest)}
                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        title="Edit Trip"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dest.id)}
                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Trip?</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to delete this trip? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={confirmDelete}
                  className="flex-grow bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-grow bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
