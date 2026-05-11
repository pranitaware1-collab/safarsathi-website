import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { saveBooking }
from '../services/bookingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  bookingFormUrl?: string;
}

export const BookingModal = ({ isOpen, onClose, destinationName, bookingFormUrl }: BookingModalProps) => {
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
  
const handleNext = async (
  e: React.FormEvent
) => {

  e.preventDefault();

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

 const message =
`Hello Suyog Aware,

New Trip Booking Request

Trip: ${destinationName}

Name: ${formData.fullName}
Age: ${formData.age}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}
Total Members: ${formData.members}

Please confirm my booking.`;

  window.open(
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    '_blank'
  );

  setHasSentWa1(true);
};

 

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {step === 'links' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Mandatory Steps</h2>
                    <p className="text-sm text-gray-500">Complete all steps to secure your booking.</p>
                  </div>

                  <div className="space-y-4">
                  
                    {/* Step 2: WhatsApp Confirmation */}
                    <div className={cn(
                      "p-5 rounded-3xl border transition-all duration-500 relative overflow-hidden",
                      hasSentWa1 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200 animate-pulse"
                    )}>
                      {!hasSentWa1 && (
                        <div className="absolute top-2 right-4">
                          <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter animate-bounce">Mandatory!</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm",
                            hasSentWa1 ? "bg-green-500 text-white" : "bg-white text-red-600"
                          )}>2</div>
                          <h4 className="font-bold text-gray-900 text-sm">WhatsApp Confirmation</h4>
                        </div>
                        {hasSentWa1 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>

                      <p className="text-[10px] text-gray-500 mb-4 font-medium leading-tight">
                        You MUST send a confirmation message to Suyog Aware to finalize your booking.
                      </p>

                      <button 
                        onClick={() => sendWhatsApp('917972519926')}
                        className={cn(
                          "w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all shadow-lg text-sm",
                          hasSentWa1 
                            ? "bg-green-100 text-green-700 border border-green-200" 
                            : "bg-green-600 text-white hover:bg-green-700 shadow-green-100"
                        )}
                      >
                        <Phone className="w-5 h-5" />
                        <span>{hasSentWa1 ? 'Message Sent to Suyog' : 'Confirm to Suyog Aware'}</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    disabled={!isBookingComplete}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl",
                      isBookingComplete 
                        ? "bg-gray-900 text-white hover:bg-indigo-600" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {isBookingComplete ? 'Finish Booking' : 'Complete All Steps'}
                  </button>

                  <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Payment: Cash or Online (Direct to Owner)
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Trip</h2>
                    <p className="text-gray-500 mb-4">
                      Enter your details to proceed with the booking for <span className="text-indigo-600 font-bold">{destinationName}</span>.
                    </p>
                  </div>

                  <form onSubmit={handleNext} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          required
                          type="text"
                         value={formData.fullName}

                          onChange={(e) =>
                         setFormData({
                        ...formData,
                    fullName: e.target.value
                      })
                      }
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                           <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                       Age
  </label>

  <input
    required
    type="number"
    min="1"
    max="100"
    value={formData.age}
    onChange={(e) =>
      setFormData({
        ...formData,
        age: e.target.value
      })
    }
    placeholder="Enter age"
    className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
  />
</div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          required
                          type="tel"
                          pattern="[0-9]{10}"
                          value={formData.phone}

                            onChange={(e) =>
                           setFormData({
                          ...formData,
                            phone: e.target.value
                             })
                             }
                          placeholder="+91 98765 43210"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
    Email
  </label>

  <div className="relative">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

    <input
      required
      type="email"
      value={formData.email}
      onChange={(e) =>
        setFormData({
          ...formData,
          email: e.target.value
        })
      }
      placeholder="example@gmail.com"
      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    />
  </div>
</div>
                    <div className="space-y-2">
  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
    Address
  </label>

  <input
    required
    type="text"
    value={formData.address}
    onChange={(e) =>
      setFormData({
        ...formData,
        address: e.target.value
      })
    }
    placeholder="Enter address"
    className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
  />
</div>

<div className="space-y-2">
  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
    Total Members
  </label>

  <input
    required
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
    placeholder="Total members"
    className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
  />
</div>
                    <button
                      type="submit"
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                    >
                      <span>Continue to Booking</span>
                      <Send className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 font-medium">
                      We do not accept payments on this website. All payments are handled offline.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
