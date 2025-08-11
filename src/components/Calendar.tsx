import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { Booking } from '../types';
import { getCalendarDates, isDateInRange, isToday } from '../utils/dateUtils';

interface CalendarProps {
  bookings: Booking[];
}

export const Calendar: React.FC<CalendarProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  const calendarDates = useMemo(() => {
    return getCalendarDates(currentDate.month(), currentDate.year());
  }, [currentDate]);

  const isDateBooked = (date: string): boolean => {
    return bookings.some(booking => 
      isDateInRange(date, booking.checkIn, booking.checkOut)
    );
  };

  const getBookingForDate = (date: string): Booking | undefined => {
    return bookings.find(booking => 
      isDateInRange(date, booking.checkIn, booking.checkOut)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' 
        ? prev.subtract(1, 'month')
        : prev.add(1, 'month')
    );
  };

  const isCurrentMonth = (date: string): boolean => {
    return dayjs(date).month() === currentDate.month();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {currentDate.format('MMMM YYYY')}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(dayjs())}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center">
              <span className="text-sm font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDates.map(date => {
            const isBooked = isDateBooked(date);
            const booking = getBookingForDate(date);
            const isTodayDate = isToday(date);
            const isCurrentMonthDate = isCurrentMonth(date);
            
            return (
              <div
                key={date}
                className={`
                  relative p-2 h-16 border border-gray-100 transition-all duration-200 hover:border-purple-200
                  ${isCurrentMonthDate ? 'bg-white' : 'bg-gray-50'}
                  ${isBooked ? 'bg-purple-100 border-purple-200' : ''}
                  ${isTodayDate ? 'ring-2 ring-purple-400' : ''}
                `}
              >
                <div className="flex flex-col h-full">
                  <span className={`
                    text-sm font-medium
                    ${!isCurrentMonthDate ? 'text-gray-400' : 'text-gray-700'}
                    ${isTodayDate ? 'text-purple-700 font-bold' : ''}
                    ${isBooked ? 'text-purple-800' : ''}
                  `}>
                    {dayjs(date).date()}
                  </span>
                  
                  {isBooked && booking && (
                    <div className="flex-1 mt-1">
                      <div className="text-xs text-purple-700 font-medium truncate">
                        {booking.customerName}
                      </div>
                      <div className="text-xs text-purple-600">
                        {booking.guestCount} guests
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-purple-400 rounded"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};