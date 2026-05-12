import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { saveBooking } from '../services/bookingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
}

export const BookingModal = ({
  isOpen,
  onClose,
  destinationName
}: BookingModalProps) => {

  const [bookingDone, setBookingDone] = useState(false);

  const [formData, setFormData] = useState({
    members: '1',
  });

  const [membersData, setMembersData] = useState([
    { name: '', age: '', phone: '', email: '', address: '' }
  ]);

  const [step, setStep] = useState<'form' | 'links'>('form');
  const [hasSentWa1, setHasSentWa1] = useState(false);

  const isBookingComplete = hasSentWa1;

  /* ✅ FIXED useEffect */
  useEffect(() => {
    const count = Number(formData.members);

    if (count < 1) return;

    const arr = Array.from({ length: count }, () => ({
      name: '',
      age: '',
      phone: '',
      email: '',
      address: ''
    }));

    setMembersData(arr);
  }, [formData.members]);

  /* ✅ VALIDATION + SAVE */
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (membersData.length === 0) {
      alert("Enter members");
      return;
    }

    for (let m of membersData) {
      if (!m.name || !m.age || !m.phone || !m.email || !m.address) {
        alert("Fill all member details");
        return;
      }

      if (!/^[A-Za-z ]{3,50}$/.test(m.name)) {
        alert("Invalid name");
        return;
      }

      if (!/^[0-9]{10}$/.test(m.phone)) {
        alert("Invalid phone");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) {
        alert("Invalid email");
        return;
      }
    }

    await saveBooking({
      tripName: destinationName,
      members: membersData
    });

    setStep('links');
  };

  /* ✅ FIXED WhatsApp */
  const sendWhatsApp = (number: string) => {
    if (hasSentWa1) return;

    const message = `
Hello Suyog Aware,

New Trip Booking Request

Trip: ${destinationName}

Total Members: ${formData.members}
`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setHasSentWa1(true);

    setTimeout(() => {
      setBookingDone(true);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* MODAL */}
          <motion.div className="relative w-full max-w-lg bg-white rounded-3xl">

            <div className="p-8">

              <button onClick={onClose} className="absolute top-4 right-4">
                <X />
              </button>

              {/* SUCCESS */}
              {bookingDone ? (
                <div className="text-center">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold">Booking Successful</h2>
                  <button onClick={onClose} className="mt-4 bg-black text-white px-4 py-2 rounded-xl">
                    Close
                  </button>
                </div>
              ) : step === "links" ? (
                <div>
                  <button
                    onClick={() => sendWhatsApp("917972519926")}
                    className="bg-green-600 text-white w-full py-3 rounded-xl"
                  >
                    Confirm WhatsApp
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNext} className="space-y-4">

                  {/* MEMBERS COUNT */}
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.members}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        members: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                  />

                  {/* MEMBERS FORM */}
                  {membersData.map((m, i) => (
                    <div key={i} className="border p-3 rounded-xl space-y-2">

                      <h3 className="font-bold">Member {i + 1}</h3>

                      <input
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => {
                          const copy = [...membersData];
                          copy[i].name = e.target.value;
                          setMembersData(copy);
                        }}
                        className="w-full border p-2 rounded"
                      />

                      <input
                        placeholder="Age"
                        value={m.age}
                        onChange={(e) => {
                          const copy = [...membersData];
                          copy[i].age = e.target.value;
                          setMembersData(copy);
                        }}
                        className="w-full border p-2 rounded"
                      />

                      <input
                        placeholder="Phone"
                        value={m.phone}
                        onChange={(e) => {
                          const copy = [...membersData];
                          copy[i].phone = e.target.value;
                          setMembersData(copy);
                        }}
                        className="w-full border p-2 rounded"
                      />

                      <input
                        placeholder="Email"
                        value={m.email}
                        onChange={(e) => {
                          const copy = [...membersData];
                          copy[i].email = e.target.value;
                          setMembersData(copy);
                        }}
                        className="w-full border p-2 rounded"
                      />

                      <input
                        placeholder="Address"
                        value={m.address}
                        onChange={(e) => {
                          const copy = [...membersData];
                          copy[i].address = e.target.value;
                          setMembersData(copy);
                        }}
                        className="w-full border p-2 rounded"
                      />

                    </div>
                  ))}

                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
                    Continue
                  </button>

                </form>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};