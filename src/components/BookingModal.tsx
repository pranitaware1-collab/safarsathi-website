import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, Mail, User, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { saveBooking } from '../services/bookingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  bookingFormUrl?: string;
}

export const BookingModal = ({
  isOpen,
  onClose,
  destinationName
}: BookingModalProps) => {

  const [bookingDone, setBookingDone] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    members: '1',
  });

  const [step, setStep] = useState<'form' | 'links'>('form');
  const [hasSentWa1, setHasSentWa1] = useState(false);

  const isBookingComplete = hasSentWa1;

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // 🔴 FULL NAME
  if (formData.fullName.trim().length < 3) {
    alert("Name must be at least 3 characters");
    return;
  }

  // 🔴 AGE
  const age = Number(formData.age);
  if (!age || age < 1 || age > 100) {
    alert("Enter valid age (1-100)");
    return;
  }

  // 🔴 EMAIL
  if (!formData.email.includes("@")) {
    alert("Enter valid email");
    return;
  }

  // 🔴 PHONE (IMPORTANT - 10 DIGITS ONLY)
  if (!/^[0-9]{10}$/.test(formData.phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  // 🔴 ADDRESS
  if (formData.address.trim().length < 10) {
    alert("Address must be at least 10 characters");
    return;
  }

  // 🔴 MEMBERS
  const members = Number(formData.members);
  if (!members || members < 1 || members > 20) {
    alert("Members must be between 1 to 20");
    return;
  }

  // ✅ SAVE ONLY IF VALID
  await saveBooking({
    tripName: destinationName,
    fullName: formData.fullName,
    age: formData.age,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    members: formData.members
  });

  setStep('links');
};

  const sendWhatsApp = (number: string) => {
    const message = `
Hello Suyog Aware,

New Trip Booking Request

Trip: ${destinationName}

Name: ${formData.fullName}
Age: ${formData.age}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}
Total Members: ${formData.members}

Please confirm my booking.
`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      '_blank'
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              {/* ================= SUCCESS ================= */}
              {bookingDone ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-5" />
                  <h2 className="text-3xl font-bold mb-3">
                    Booking Successful
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Thank you for booking with SafarSathi.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl"
                  >
                    Back To Website
                  </button>
                </div>

              ) : step === 'links' ? (

                /* ================= LINKS STEP ================= */
                <div className="space-y-6">

                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Mandatory Steps</h2>
                    <p className="text-sm text-gray-500">
                      Complete booking process
                    </p>
                  </div>

                  {/* WhatsApp Step */}
                  <div className={cn(
                    "p-5 rounded-3xl border",
                    hasSentWa1
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  )}>

                    <p className="text-sm mb-3">
                      Send WhatsApp confirmation
                    </p>

                    <button
                      onClick={() => sendWhatsApp('917972519926')}
                      className="w-full py-4 bg-green-600 text-white rounded-xl flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>
                        {hasSentWa1 ? 'Message Sent' : 'Confirm Booking'}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    disabled={!isBookingComplete}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold",
                      isBookingComplete
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-400"
                    )}
                  >
                    Finish Booking
                  </button>

                </div>

              ) : (

                /* ================= FORM STEP ================= */
                <form onSubmit={handleNext} className="space-y-5">

                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">
                      Book {destinationName}
                    </h2>
                  </div>

                  <input
                    required
                    placeholder="Full Name"
                    
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    
                  />

                  <input
                    required
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    required
                    type="tel"
                    placeholder="Phone"
                    
                    value={formData.phone}
                    
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    
                  />

                  <input
                    required
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    required
                    type="number"
                    placeholder="Members"
                    value={formData.members}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        members: e.target.value
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                  />

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Continue</span>
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