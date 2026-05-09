// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, LayoutDashboard,
  LogOut, Image as ImageIcon, IndianRupee,
  MapPin, Save, X, Search, Bell,
  FileText, Hotel, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../context/DestinationContext';
import { Destination } from '../types';
import { cn } from '../lib/utils';

import { getNotice, updateNotice } from '../services/settingsService';
import { AdminNoticeBoard } from './AdminNoticeBoard';

export const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const { destinations, addDestination, updateDestination, deleteDestination } = useDestinations();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthorized = isAdmin || location.state?.authorized;

  // Tabs
  const [activeTab, setActiveTab] = useState<'destinations' | 'notice'>('destinations');

  // Destinations states
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Destination>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Notice states
  const [noticeContent, setNoticeContent] = useState('');
  const [isSavingNotice, setIsSavingNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] =
    useState<{ type: 'success' | 'error', text: string } | null>(null);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    if (!isAuthorized) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthorized, navigate]);

  if (!isAuthorized) return null;

  /* ---------------- NOTICE FETCH ---------------- */
  useEffect(() => {
    if (activeTab === 'notice') {
      const fetchNotice = async () => {
        const data = await getNotice();
        setNoticeContent(data);
      };
      fetchNotice();
    }
  }, [activeTab]);

  const handleSaveNotice = async () => {
    setIsSavingNotice(true);
    setNoticeMessage(null);
    try {
      await updateNotice(noticeContent);
      setNoticeMessage({ type: 'success', text: 'Notice updated!' });
    } catch {
      setNoticeMessage({ type: 'error', text: 'Failed to update notice.' });
    } finally {
      setIsSavingNotice(false);
    }
  };

  /* ---------------- DESTINATION FUNCTIONS ---------------- */

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setIsEditing(null);
    setEditForm({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category: 'Cities',
      image: '',
      description: '',
      longDescription: '',
      budgetEstimate: '',
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

  const handleEdit = (dest: Destination) => {
    setIsEditing(dest.id);
    setIsAdding(false);
    setEditForm(dest);
  };

  const handleSave = () => {
    const finalForm = { ...editForm };

    if (isEditing) {
      updateDestination(isEditing, finalForm);
      setIsEditing(null);
    } else {
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

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r flex flex-col">

        <div className="p-6 border-b">
          <h1 className="font-black text-xl">Admin Panel</h1>
          <p className="text-xs text-indigo-600">SafarSathi</p>
        </div>

        <div className="flex-grow p-4 space-y-2">

          <button
            onClick={() => setActiveTab('destinations')}
            className={cn(
              "w-full flex items-center gap-2 p-3 rounded-xl",
              activeTab === 'destinations' ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Trips
          </button>

          <button
            onClick={() => setActiveTab('notice')}
            className={cn(
              "w-full flex items-center gap-2 p-3 rounded-xl",
              activeTab === 'notice' ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
            )}
          >
            <Bell className="w-5 h-5" />
            Notice Board
          </button>

        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-500"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex-grow p-6">

        {/* DESTINATIONS */}
        {activeTab === 'destinations' && (
          <>
            <div className="flex justify-between mb-6">
              <h1 className="text-3xl font-black">Trips</h1>
              <button
                onClick={handleAddNew}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
              >
                <Plus /> Add Trip
              </button>
            </div>

            <input
              className="p-3 w-full border rounded-xl mb-6"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filteredDestinations.map(dest => (
              <div key={dest.id} className="bg-white p-4 rounded-xl flex justify-between mb-3">
                <div>
                  <h2 className="font-bold">{dest.name}</h2>
                  <p className="text-indigo-600">{dest.budgetEstimate}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(dest)}>
                    <Edit2 />
                  </button>
                  <button onClick={() => handleDelete(dest.id)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}

          </>
        )}

        {/* NOTICE */}
        {activeTab === 'notice' && (
          <AdminNoticeBoard
            noticeContent={noticeContent}
            setNoticeContent={setNoticeContent}
            isSavingNotice={isSavingNotice}
            noticeMessage={noticeMessage}
            handleSaveNotice={handleSaveNotice}
          />
        )}

      </div>

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <p>Delete this trip?</p>
            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 mr-2">
              Yes
            </button>
            <button onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};