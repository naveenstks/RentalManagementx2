import dayjs from 'dayjs';
import { Booking, CustomerHistory, BookingStats, MonthlySummary } from '../types';
import { calculateNights } from './dateUtils';

export const generateBookingId = (): string => {
  return `BK${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
};

export const getCustomerHistory = (phone: string, bookings: Booking[], excludeCurrentId?: string): CustomerHistory => {
  const customerBookings = bookings.filter(b => 
    b.customerPhone === phone && (!excludeCurrentId || b.id !== excludeCurrentId)
  );
  
  const totalNights = customerBookings.reduce((sum, booking) => 
    sum + calculateNights(booking.checkIn, booking.checkOut), 0
  );
  
  return {
    totalBookings: customerBookings.length,
    totalNights
  };
};

export const isRepeatCustomer = (phone: string, bookings: Booking[], excludeCurrentId?: string): boolean => {
  const history = getCustomerHistory(phone, bookings, excludeCurrentId);
  return history.totalBookings > 0;
};

export const calculateBookingStats = (bookings: Booking[]): BookingStats => {
  const stats: BookingStats = {};
  
  bookings.forEach(booking => {
    const date = dayjs(booking.checkIn);
    const year = date.year().toString();
    const month = date.format('MMMM');
    
    if (!stats[year]) {
      stats[year] = {};
    }
    
    if (!stats[year][month]) {
      stats[year][month] = {
        bookings: 0,
        nights: 0,
        revenue: 0
      };
    }
    
    stats[year][month].bookings += 1;
    stats[year][month].nights += calculateNights(booking.checkIn, booking.checkOut);
    stats[year][month].revenue += booking.totalAmount;
  });
  
  return stats;
};

export const searchBookings = (bookings: Booking[], query: string): Booking[] => {
  if (!query.trim()) return bookings;
  
  const searchTerm = query.toLowerCase().trim();
  
  return bookings.filter(booking => {
    // Search by name
    if (booking.customerName.toLowerCase().includes(searchTerm)) return true;
    
    // Search by phone
    if (booking.customerPhone.includes(searchTerm)) return true;
    
    // Search by booking ID
    if (booking.id.toLowerCase().includes(searchTerm)) return true;
    
    // Search by date formats (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD)
    const checkInFormatted = dayjs(booking.checkIn).format('DD/MM/YYYY');
    const checkOutFormatted = dayjs(booking.checkOut).format('DD/MM/YYYY');
    const checkInAltFormat = dayjs(booking.checkIn).format('DD-MM-YYYY');
    const checkOutAltFormat = dayjs(booking.checkOut).format('DD-MM-YYYY');
    const checkInISOFormat = dayjs(booking.checkIn).format('YYYY-MM-DD');
    const checkOutISOFormat = dayjs(booking.checkOut).format('YYYY-MM-DD');
    
    if (checkInFormatted.includes(searchTerm) || 
        checkOutFormatted.includes(searchTerm) ||
        checkInAltFormat.includes(searchTerm) ||
        checkOutAltFormat.includes(searchTerm) ||
        checkInISOFormat.includes(searchTerm) ||
        checkOutISOFormat.includes(searchTerm)) {
      return true;
    }
    
    return false;
  });
};

export const getBookingDetails = (booking: Booking, customerHistory: CustomerHistory): string => {
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  
  const details = `Booking ID: ${booking.id}
Customer: ${booking.customerName}
Phone: ${booking.customerPhone}
Check-in: ${dayjs(booking.checkIn).format('DD/MM/YYYY')}
Check-out: ${dayjs(booking.checkOut).format('DD/MM/YYYY')}
Nights: ${nights}
Guests: ${booking.guestCount}
Type: ${booking.bookingType === 'bachelors' ? 'Bachelor Party' : 'Family Stay'}
Total Amount: ₹${booking.totalAmount}
Advance: ₹${booking.advanceAmount}
Balance: ₹${booking.balanceAmount}${customerHistory.totalBookings > 0 ? `
Repeat Customer: ${customerHistory.totalBookings} previous bookings, ${customerHistory.totalNights} total nights` : ''}

Rules: 1. Unmarried couples not allowed. 2. Pets are not allowed. 3. Smoking inside villa not allowed. 4. Playing cards is strictly prohibited. 5. Extra head count ₹300/person will be charged beyond confirmed guest count. 6. No cancellation & no refund.`;

  return details;
};