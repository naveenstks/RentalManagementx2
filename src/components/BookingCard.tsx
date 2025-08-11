import React from 'react';
import { Calendar, Users, Phone, Copy, Star, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { Booking, CustomerHistory } from '../types';
import { calculateNights } from '../utils/dateUtils';
import { getBookingDetails } from '../utils/bookingUtils';

interface BookingCardProps {
  booking: Booking;
  customerHistory: CustomerHistory;
  onCopyDetails: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  customerHistory, 
  onCopyDetails 
}) => {
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const isRepeat = customerHistory.totalBookings > 0;
  
  const handleCopyClick = () => {
    const details = getBookingDetails(booking, customerHistory);
    navigator.clipboard.writeText(details);
    onCopyDetails();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">{booking.customerName}</h3>
          {isRepeat && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-purple-600 fill-current" />
              <span className="text-xs font-medium text-purple-700">Repeat Guest</span>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {booking.id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4 text-purple-600" />
          <span className="text-sm">{booking.customerPhone}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="text-sm">{booking.guestCount} guests</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span className="text-sm">
            {dayjs(booking.checkIn).format('MMM DD')} - {dayjs(booking.checkOut).format('MMM DD')}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm font-medium">
            {nights} night{nights !== 1 ? 's' : ''} • {booking.bookingType === 'bachelors' ? 'Bachelor Party' : 'Family Stay'}
          </span>
        </div>
      </div>

      {isRepeat && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4 border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Customer History: {customerHistory.totalBookings} booking{customerHistory.totalBookings !== 1 ? 's' : ''}, 
              {customerHistory.totalNights} total night{customerHistory.totalNights !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-sm font-semibold text-gray-800">₹{booking.totalAmount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Advance</p>
            <p className="text-sm font-semibold text-green-600">₹{booking.advanceAmount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Balance</p>
            <p className="text-sm font-semibold text-orange-600">₹{booking.balanceAmount}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCopyClick}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Copy className="w-4 h-4" />
        Copy Details
      </button>
    </div>
  );
};