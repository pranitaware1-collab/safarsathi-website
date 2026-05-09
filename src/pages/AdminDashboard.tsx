import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, LayoutDashboard,
  LogOut, Bell
} from 'lucide-react';
import { motion } from 'motion/react';

import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../context/DestinationContext';
import { Destination } from '../types';
import { cn } from '../lib/utils';

import { getNotice, updateNotice } from '../services/settingsService';

/* ---------------- DRIVE HELPERS ---------------- */
const convertDriveImage = (url: string) => {
  if (!url) return url;
  const match = url.match(/\/d\/(.*?)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
};

const convertDrivePdf = (url: string) => {
  if (!url) return url;
  const match = url.match(/\/d\/(.*?)\//);
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
};

/* ---------------- MAIN ---------------- */
export const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const { destinations, addDestination, updateDestination, deleteDestination } = useDestinations();

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthorized = isAdmin || location.state?.authorized;

  const [activeTab, setActiveTab] = useState<'destinations' | 'notice'>('destinations');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [editForm, setEditForm] = useState<Partial<Destination>>({});

  const [notice, setNotice] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);

  useEffect(() => {
    if (!isAuthorized) navigate('/admin/login', { replace: true });
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  useEffect(() => {
    if (activeTab === 'notice') {
      getNotice().then(setNotice);
    }
  }, [activeTab]);

  const handleSaveNotice = async () => {
    setSavingNotice(true);
    await updateNotice(notice);
    setSavingNotice(false);
    alert('Notice Updated');
  };

  /* ---------------- ADD ---------------- */
  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      id: Math.random().toString(36).slice(2),
      name: '',
      category: 'Cities',
      image: '',
      description: '',
      longDescription: '',
      budgetEstimate: '',
      bestTimeToVisit: '',
      coordinates: { lat: 0, lng: 0 },
      itinerary: [],
      nearbyHotels: [],
      nearbyRestaurants: [],
      itineraryPdfUrl: '',
      itineraryPdfUrl2: '',   // ✅ NEW
      tripPlanUrl: '',
      bookingFormUrl: '',
      googleSheetUrl: ''       // ✅ NEW
    });
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = () => {
    let data = { ...editForm };

    data.image = convertDriveImage(data.image || '');
    data.itineraryPdfUrl = convertDrivePdf(data.itineraryPdfUrl || '');
    data.itineraryPdfUrl2 = convertDrivePdf(data.itineraryPdfUrl2 || '');
    data.tripPlanUrl = convertDrivePdf(data.tripPlanUrl || '');

    if (isEditing) updateDestination(isEditing, data);
    else addDestination(data as Destination);

    setIsEditing(null);
    setIsAdding(false);
  };

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-black text-xl">Admin Panel</h1>
          <p className="text-indigo-600 text-xs">SafarSathi</p>
        </div>

        <button onClick={() => setActiveTab('destinations')}
          className={cn("p-3 m-2 rounded-xl border",
            activeTab === 'destinations' && "bg-indigo-50 text-indigo-600")}>
          Trips
        </button>

        <button onClick={() => setActiveTab('notice')}
          className={cn("p-3 m-2 rounded-xl border",
            activeTab === 'notice' && "bg-indigo-50 text-indigo-600")}>
          Notice
        </button>

        <button onClick={logout} className="mt-auto p-4 text-red-500 border-t">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {activeTab === 'destinations' && (
          <>
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">Trips</h1>
              <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-xl">
                + Add Trip
              </button>
            </div>

            <input
              className="border p-3 w-full rounded-xl mb-4"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {/* LIST */}
            {filtered.map(dest => (
              <div key={dest.id} className="bg-white border rounded-xl p-4 mb-3 flex justify-between">

                <div>
                  <h2 className="font-bold">{dest.name}</h2>
                  <p className="text-sm text-gray-500">{dest.budgetEstimate}</p>

                  {/* NEW LINKS DISPLAY */}
                  {dest.googleSheetUrl && (
                    <a href={dest.googleSheetUrl} target="_blank" className="text-blue-600 text-sm">
                      Google Sheet Booking
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(dest.id); setEditForm(dest); }}>
                    <Edit2 />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(dest.id)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}

            {/* EDIT FORM */}
            {(isAdding || isEditing) && (
              <motion.div className="bg-white border p-5 rounded-xl mt-6 space-y-3">

                <input placeholder="Name"
                  className="border p-2 w-full"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />

                <input placeholder="Image (Google Drive)"
                  className="border p-2 w-full"
                  value={editForm.image || ''}
                  onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                />

                <textarea placeholder="Description"
                  className="border p-2 w-full"
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />

                {/* ITINERARY LINKS */}
                <input placeholder="Itinerary PDF 1"
                  className="border p-2 w-full"
                  value={editForm.itineraryPdfUrl || ''}
                  onChange={e => setEditForm({ ...editForm, itineraryPdfUrl: e.target.value })}
                />

                <input placeholder="Itinerary PDF 2"
                  className="border p-2 w-full"
                  value={editForm.itineraryPdfUrl2 || ''}
                  onChange={e => setEditForm({ ...editForm, itineraryPdfUrl2: e.target.value })}
                />

                {/* GOOGLE SHEET */}
                <input placeholder="Google Sheet Booking Link"
                  className="border p-2 w-full"
                  value={editForm.googleSheetUrl || ''}
                  onChange={e => setEditForm({ ...editForm, googleSheetUrl: e.target.value })}
                />

                <button onClick={handleSave}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl w-full">
                  Save Trip
                </button>

              </motion.div>
            )}
          </>
        )}

        {/* NOTICE */}
        {activeTab === 'notice' && (
          <div className="bg-white p-4 rounded-xl border">
            <textarea
              className="w-full border p-3 rounded-xl"
              value={notice}
              onChange={e => setNotice(e.target.value)}
            />
            <button
              onClick={handleSaveNotice}
              className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded-xl"
            >
              Save Notice
            </button>
          </div>
        )}

      </div>
    </div>
  );
};