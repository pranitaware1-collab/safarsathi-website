import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit2, Trash2, LayoutDashboard, LogOut, Bell } from 'lucide-react';
import { motion } from 'motion/react';

import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../context/DestinationContext';
import { Destination } from '../types';
import { cn } from '../lib/utils';
import { Booking } from '../types';
import { getNotice, updateNotice } from '../services/settingsService';

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // तुमचा firebase config path




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
 const {
  destinations,
  addDestination,
  updateDestination,
  deleteDestination
} = useDestinations();
 const [bookings, setBookings] = useState<Booking[]>([]);

 const fetchBookings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));

    const data: any[] = [];

    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("🔥 FIREBASE DATA:", data);

    setBookings(data);
  } catch (error) {
    console.error("Firebase fetch error:", error);
  }
};

  const navigate = useNavigate();
  const location = useLocation();
  

  const isAuthorized = isAdmin || location.state?.authorized;

  const [activeTab, setActiveTab] = useState<'destinations' | 'notice'>('destinations');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [search, setSearch] = useState('');
  const [editForm, setEditForm] = useState<Partial<Destination>>({});

  const [notice, setNotice] = useState('');



  /* AUTH */
  useEffect(() => {
  // Firebase / API call इथे येईल
  // example:
  setBookings([]); // replace with real data
}, []);
  useEffect(() => {
    if (!isAuthorized) navigate('/admin/login', { replace: true });
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  /* NOTICE */
  useEffect(() => {
    if (activeTab === 'notice') {
      getNotice().then(setNotice);
    }
  }, [activeTab]);

  const handleSaveNotice = async () => {
    await updateNotice(notice);
    alert('Notice Updated');
  };

  const handleDelete = async (id: string) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this trip?"
  );

  if (!confirmDelete) return;

  await deleteDestination(id);
};
const downloadCSV = (trip: any) => {
  if (!trip || !trip.members || trip.members.length === 0) {
    alert("No booking data available");
    return;
  }

  const headers = ["Name", "Age", "Phone", "Email", "Address"];

  const rows = trip.members.map((m: any) => [
    m.name || "",
    m.age || "",
    m.phone || "",
    m.email || "",
    m.address || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((r: any) => r.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${trip.tripName || "booking"}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
const deleteTrip = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this trip?"
  );

  if (!confirmDelete) return;

  console.log("Delete trip:", id);
};
  /* ADD */
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
      price: '',
      bestTimeToVisit: '',
      coordinates: { lat: 0, lng: 0 },
      itinerary: [],
      nearbyHotels: [],
      nearbyRestaurants: [],
      itineraryPdfUrl: '',
      tripPlanUrl: '',
      bookingFormUrl: '',
      googleSheetUrl: ''
    });
  };

  /* SAVE */
  const handleSave = () => {
  let data: Destination = { ...editForm } as Destination;

  const handleDelete = async (id: string) => {

};

  // ensure ID exists
  if (!data.id) {
    data.id = Math.random().toString(36).slice(2);
  }

  // Google Drive conversion (IMPORTANT FIX retained)
  data.image = convertDriveImage(data.image || '');
  data.itineraryPdfUrl = convertDrivePdf(data.itineraryPdfUrl || '');
  data.tripPlanUrl = convertDrivePdf(data.tripPlanUrl || '');

  // SAVE LOGIC
  if (isEditing) {
    updateDestination(isEditing, data);
  } else {
    addDestination(data);
  }

  setIsEditing(null);
  setIsAdding(false);
};

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-black text-xl">Admin Panel</h1>
          <p className="text-indigo-600 text-xs">SafarSathi</p>
        </div>

        <button onClick={() => setActiveTab('destinations')}
          className={cn("p-3 m-2 rounded-xl",
            activeTab === 'destinations' && "bg-indigo-50 text-indigo-600")}>
          Trips
        </button>

        <button onClick={() => setActiveTab('notice')}
          className={cn("p-3 m-2 rounded-xl",
            activeTab === 'notice' && "bg-indigo-50 text-indigo-600")}>
          Notice
        </button>

        <button onClick={logout} className="mt-auto p-4 text-red-500 border-t">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* TRIPS */}
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

                  <p className="text-gray-500 text-sm">{dest.budgetEstimate}</p>

                  <div className="flex gap-2 mt-2">

 <button
  onClick={() => {
    const trip = bookings.find(
      b =>
        b.tripName?.trim().toLowerCase() ===
        dest.name?.trim().toLowerCase()
    );

    console.log("DEST:", dest.name);
    console.log("BOOKINGS:", bookings);
    console.log("FOUND TRIP:", trip);

    if (trip) {
      downloadCSV(trip);
    } else {
      alert("Booking not found");
    }
  }}
>
  Download CSV
</button>

  <button
    onClick={() => dest.id && deleteTrip(dest.id)}
    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
  >
    Delete Trip DATA
  </button>

</div>

                  {/* PRICE FIX */}
                  <p className="text-green-600 font-bold">
                    ₹{dest.price}
                  </p>

                  {/* GOOGLE SHEET */}
                  {dest.googleSheetUrl && (
                    <a href={dest.googleSheetUrl} target="_blank"
                      className="text-blue-600 text-sm underline">
                      Booking Sheet
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                 <button
  onClick={() => {
    if (!dest.id) return;
    setIsEditing(dest.id);
    setEditForm(dest);
  }}
>
                    <Edit2 />
                  </button>
                 <button
           onClick={() => dest.id && handleDelete(dest.id)}
              >
              <Trash2 />
                 </button>
                </div>
              </div>
            ))}

            {/* FORM */}
            {(isAdding || isEditing) && (
              <motion.div className="bg-white border p-5 rounded-xl mt-6 space-y-3">

                <input placeholder="Name"
                  className="border p-2 w-full"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />

                <input placeholder="Image (Drive)"
                  className="border p-2 w-full"
                  value={editForm.image || ''}
                  onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                />

                <input placeholder="Price"
                  className="border p-2 w-full"
                  value={editForm.price || ''}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                />

                <input placeholder="Google Sheet Link"
                  className="border p-2 w-full"
                  value={editForm.googleSheetUrl || ''}
                  onChange={e => setEditForm({ ...editForm, googleSheetUrl: e.target.value })}
                />

                <input placeholder="Itinerary PDF"
                  className="border p-2 w-full"
                  value={editForm.itineraryPdfUrl || ''}
                  onChange={e => setEditForm({ ...editForm, itineraryPdfUrl: e.target.value })}
                />

                <select
  className="border p-2 w-full"
  value={editForm.category || 'Cities'}
  onChange={(e) =>
  setEditForm({
    ...editForm,
    category: e.target.value as Destination['category']
  })
}
>
  <option value="Beaches">Beaches</option>
  <option value="Mountains">Mountains</option>
 <option value="Historical Places">Historical Places</option>
  <option value="Cities">Cities</option>
  <option value="Religious">Religious</option>
</select>

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