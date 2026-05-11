import React, {
  useEffect,
  useState
} from 'react';

import { getBookings }
from '../services/bookingService';

import * as XLSX from 'xlsx';

export const AdminBookings = () => {

  const [bookings, setBookings] =
    useState<any[]>([]);

  useEffect(() => {

    loadBookings();

  }, []);

  const loadBookings = async () => {

    const data =
      await getBookings();

    setBookings(data);
  };

  const downloadCSV = () => {

  const worksheet =
    XLSX.utils.json_to_sheet(bookings);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Bookings'
  );

  XLSX.writeFile(
    workbook,
    'SafarSathiBookings.xlsx'
  );
};
const exportBookings = () => {

  const worksheet =
    XLSX.utils.json_to_sheet(bookings);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Bookings'
  );

  XLSX.writeFile(
    workbook,
    'SafarSathi_Bookings.xlsx'
  );
};
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        All Bookings
      </h1>
      <button
  onClick={downloadCSV}
  className="mb-6 bg-green-600 text-white px-5 py-3 rounded-2xl font-bold"
>
  Download CSV
</button>

      <button
  onClick={exportBookings}
  className="mb-6 bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
>
  Download Excel
</button>

      <div className="space-y-4">

        {bookings.map((b) => (

          <div
            key={b.id}
            className="bg-white border rounded-2xl p-5"
          >
            <h2 className="font-bold text-xl">
              {b.tripName}
            </h2>

            <p>Name: {b.fullName}</p>

            <p>Phone: {b.phone}</p>

            <p>Email: {b.email}</p>

            <p>Members: {b.members}</p>

            <p>Address: {b.address}</p>
          </div>
        ))}

      </div>
    </div>
  );
};