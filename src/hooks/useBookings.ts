import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types';
import { saveBookings, loadBookings } from '../utils/localStorage';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedBookings = loadBookings();
    setBookings(savedBookings);
    setLoading(false);
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  }, [bookings]);

  const updateBooking = useCallback((id: string, updatedBooking: Booking) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? updatedBooking : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  }, [bookings]);

  const deleteBooking = useCallback((id: string) => {
    const updatedBookings = bookings.filter(booking => booking.id !== id);
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  }, [bookings]);

  return {
    bookings,
    loading,
    addBooking,
    updateBooking,
    deleteBooking
  };
};