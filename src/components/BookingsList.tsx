import React, { useMemo, useState } from 'react';
import { Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { Booking } from '../types';
import { BookingCard } from './BookingCard';
import { getCustomerHistory } from '../utils/bookingUtils';

interface BookingsListProps {
  bookings: Booking[];
  title: string;
  icon: React.ReactNode;
  period: 'last' | 'current' | 'next' | 'upcoming';
}

export const BookingsList: React.FC<BookingsListProps> = ({ 
  bookings, 
  title, 
  icon, 
  period 
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const filteredBookings = useMemo(() => {
    const now = dayjs();
    
    switch (period) {
      case 'last':
        return bookings.filter(booking => 
          dayjs(booking.checkIn).month() === now.subtract(1, 'month').month() &&
          dayjs(booking.checkIn).year() === now.subtract(1, 'month').year()
        );
      case 'current':
        return bookings.filter(booking => 
          dayjs(booking.checkIn).month() === now.month() &&
          dayjs(booking.checkIn).year() === now.year()
        );
      case 'next':
        return bookings.filter(booking => 
          dayjs(booking.checkIn).month() === now.add(1, 'month').month() &&
          dayjs(booking.checkIn).year() === now.add(1, 'month').year()
        );
      case 'upcoming':
        return bookings.filter(booking => 
          dayjs(booking.checkIn).isAfter(now, 'day')
        ).sort((a, b) => dayjs(a.checkIn).diff(dayjs(b.checkIn)));
      default:
        return bookings;
    }
  }, [bookings, period]);

  const handleCopyDetails = (bookingId: string) => {
    setCopiedId(bookingId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalNights = filteredBookings.reduce((sum, booking) => 
    sum + dayjs(booking.checkOut).diff(dayjs(booking.checkIn), 'day'), 0
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        
        {filteredBookings.length > 0 && (
          <div className="flex items-center gap-6 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg border border-purple-200">
            <div className="text-center">
              <p className="text-sm text-purple-600">Bookings</p>
              <p className="font-semibold text-purple-800">{filteredBookings.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-purple-600">Nights</p>
              <p className="font-semibold text-purple-800">{totalNights}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-purple-600">Revenue</p>
              <p className="font-semibold text-purple-800">₹{totalRevenue}</p>
            </div>
          </div>
        )}
      </div>

      {copiedId && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">Booking details copied to clipboard!</span>
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No bookings found</h3>
          <p className="text-gray-400">There are no bookings for this period yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map(booking => {
            const customerHistory = getCustomerHistory(booking.customerPhone, bookings, booking.id);
            
            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                customerHistory={customerHistory}
                onCopyDetails={() => handleCopyDetails(booking.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};