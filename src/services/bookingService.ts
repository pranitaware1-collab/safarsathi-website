import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebase';

export const saveBooking = async (
  bookingData: any
) => {

  await addDoc(
    collection(db, 'bookings'),
    {
      ...bookingData,
      createdAt: serverTimestamp()
    }
  );
};

export const getBookings = async () => {

  const querySnapshot =
    await getDocs(
      collection(db, 'bookings')
    );

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};