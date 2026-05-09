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

/* ---------------- MAIN COMPONENT ---------------- */
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

  /* Notice */
  const [notice, setNotice] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    if (!isAuthorized) navigate('/admin/login', { replace: true });
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  /* ---------------- NOTICE ---------------- */
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

  /* ---------------- DESTINATION ---------------- */

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
      tripPlanUrl: '',
      bookingFormUrl: ''
    });
  };

  const handleSave = () => {
    let data = { ...editForm };

    data.image = convertDriveImage(data.image || '');
    data.itineraryPdfUrl = convertDrivePdf(data.itineraryPdfUrl || '');
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
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-black text-xl">Admin Panel</h1>
          <p className="text-indigo-600 text-xs">SafarSathi</p>
        </div>

        <div className="p-4 space-y-2">
          <button onClick={() => setActiveTab('destinations')}
            className={cn("w-full p-3 rounded-xl flex gap-2",
              activeTab === 'destinations' ? "bg-indigo-50 text-indigo-600" : "")}>
            <LayoutDashboard /> Trips
          </button>

          <button onClick={() => setActiveTab('notice')}
            className={cn("w-full p-3 rounded-xl flex gap-2",
              activeTab === 'notice' ? "bg-indigo-50 text-indigo-600" : "")}>
            <Bell /> Notice
          </button>
        </div>

        <button onClick={logout} className="p-4 text-red-500 flex gap-2">
          <LogOut /> Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* ---------------- DESTINATIONS ---------------- */}
        {activeTab === 'destinations' && (
          <>
            <div className="flex justify-between mb-6">
              <h1 className="text-3xl font-black">Trips</h1>
              <button onClick={handleAdd}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex gap-2">
                <Plus /> Add Trip
              </button>
            </div>

            <input
              className="p-3 w-full border rounded-xl mb-4"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {/* LIST */}
            {filtered.map(dest => (
              <div key={dest.id} className="bg-white p-4 rounded-xl flex justify-between mb-3">

                <div className="flex gap-4">
                  <img
                    src={dest.image}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="font-bold">{dest.name}</h2>
                    <p className="text-indigo-600">{dest.budgetEstimate}</p>
                  </div>
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

            {/* FULL EDIT FORM */}
            {(isAdding || isEditing) && (
              <motion.div className="bg-white p-6 rounded-xl mt-6 space-y-4">

                <input placeholder="Name"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })} />

                <input placeholder="Image (Google Drive)"
                  value={editForm.image || ''}
                  onChange={e => setEditForm({ ...editForm, image: e.target.value })} />

                <textarea placeholder="Description"
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })} />

                {/* ITINERARY */}
                <div>
                  <h3 className="font-bold">Itinerary</h3>

                  {(editForm.itinerary || []).map((day, i) => (
                    <div key={i} className="border p-2 rounded mb-2">
                      <input
                        value={day.activities.join(',')}
                        onChange={e => {
                          const arr = [...(editForm.itinerary || [])];
                          arr[i].activities = e.target.value.split(',');
                          setEditForm({ ...editForm, itinerary: arr });
                        }}
                      />
                    </div>
                  ))}

                  <button onClick={() => {
                    const arr = [...(editForm.itinerary || [])];
                    arr.push({ day: arr.length + 1, activities: [] });
                    setEditForm({ ...editForm, itinerary: arr });
                  }}>
                    + Add Day
                  </button>
                </div>

                {/* HOTELS */}
                <input placeholder="Hotels (comma)"
                  value={editForm.nearbyHotels?.join(',') || ''}
                  onChange={e =>
                    setEditForm({ ...editForm, nearbyHotels: e.target.value.split(',') })
                  }
                />

                {/* RESTAURANTS */}
                <input placeholder="Restaurants (comma)"
                  value={editForm.nearbyRestaurants?.join(',') || ''}
                  onChange={e =>
                    setEditForm({ ...editForm, nearbyRestaurants: e.target.value.split(',') })
                  }
                />

                <button onClick={handleSave}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl">
                  Save
                </button>

              </motion.div>
            )}
          </>
        )}

        {/* ---------------- NOTICE ---------------- */}
        {activeTab === 'notice' && (
          <div>
            <textarea
              className="w-full p-4 border rounded-xl"
              value={notice}
              onChange={e => setNotice(e.target.value)}
            />

            <button
              onClick={handleSaveNotice}
              className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded-xl"
              disabled={savingNotice}
            >
              Save Notice
            </button>
          </div>
        )}

      </div>
    </div>
  );
};