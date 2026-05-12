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

  useEffect(() => {

  const done =
    localStorage.getItem("bookingDone");

  if (done === "true") {

    setBookingDone(true);

    localStorage.removeItem("bookingDone");
  }

}, []);

 /* ✅ STRONG VALIDATION + SAVE */
const handleNext = async (e: React.FormEvent) => {

  e.preventDefault();

  // MEMBERS CHECK
  if (!membersData || membersData.length === 0) {
    alert("Please enter member details");
    return;
  }

  // DUPLICATE CHECK
  const usedPhones = new Set();
  const usedEmails = new Set();

  for (let i = 0; i < membersData.length; i++) {

    const m = membersData[i];

    // REMOVE EXTRA SPACES
    const name = m.name.trim();
    const age = m.age.trim();
    const phone = m.phone.trim();
    const email = m.email.trim().toLowerCase();
    const address = m.address.trim();

    /* ---------------- REQUIRED ---------------- */

    if (
      !name ||
      !age ||
      !phone ||
      !email ||
      !address
    ) {
      alert(`All fields are mandatory for Member ${i + 1}`);
      return;
    }

    /* ---------------- NAME ---------------- */

    if (!/^[A-Za-z ]{3,50}$/.test(name)) {
      alert(
        `Member ${i + 1}: Name must contain only letters (3-50 characters)`
      );
      return;
    }

    // Prevent repeated spaces
    if (name.includes("  ")) {
      alert(`Member ${i + 1}: Invalid name format`);
      return;
    }

    /* ---------------- AGE ---------------- */

    const ageNumber = Number(age);

    if (
      isNaN(ageNumber) ||
      ageNumber < 1 ||
      ageNumber > 100
    ) {
      alert(
        `Member ${i + 1}: Age must be between 1 and 100`
      );
      return;
    }

    /* ---------------- PHONE ---------------- */

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      alert(
        `Member ${i + 1}: Enter valid Indian mobile number`
      );
      return;
    }

    // Duplicate phone check
    if (usedPhones.has(phone)) {
      alert(
        `Duplicate phone number found for Member ${i + 1}`
      );
      return;
    }

    usedPhones.add(phone);

    /* ---------------- EMAIL ---------------- */

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      alert(
        `Member ${i + 1}: Invalid email address`
      );
      return;
    }

    // Duplicate email check
    if (usedEmails.has(email)) {
      alert(
        `Duplicate email found for Member ${i + 1}`
      );
      return;
    }

    usedEmails.add(email);

    /* ---------------- ADDRESS ---------------- */

    if (address.length < 5) {
      alert(
        `Member ${i + 1}: Address too short`
      );
      return;
    }

    // Prevent suspicious symbols
    if (/[<>]/.test(address)) {
      alert(
        `Member ${i + 1}: Invalid address`
      );
      return;
    }

    /* ---------------- SAVE CLEAN DATA ---------------- */

    membersData[i] = {
      name,
      age,
      phone,
      email,
      address
    };
  }

  /* ---------------- SAVE FIREBASE ---------------- */

  await saveBooking({
    tripName: destinationName,
    createdAt: new Date().toISOString().split("T")[0],
    members: membersData
  });

  setStep("links");
};

  /* ✅ FIXED WhatsApp */
  const sendWhatsApp = (number: string) => {

  const membersText = membersData
    .map(
      (m, i) =>
        `${i + 1}. ${m.name} - ${m.phone}`
    )
    .join("\n");

  const message = `
Hello Suyog Aware,

New Trip Booking Request

Trip: ${destinationName}

Total Members: ${formData.members}

${membersText}
`;

  localStorage.setItem("bookingDone", "true");

  window.location.href =
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    setHasSentWa1(true);

   setTimeout(() => {
  setBookingDone(true);

  window.location.href = "/";
}, 5000);
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
         <motion.div className="relative w-full max-w-lg bg-white rounded-3xl max-h-[90vh] overflow-y-auto">

            <div className="p-8">

             {step === "form" && (
  <button
    onClick={onClose}
    className="absolute top-4 right-4"
  >
    <X />
  </button>
)}

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
  disabled={hasSentWa1}
  onClick={() => sendWhatsApp("917972519926")}
                    className="bg-green-600 text-white w-full py-3 rounded-xl disabled:opacity-50"
                  >
                    Conformation on  WhatsApp
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