import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Booking } from '../types';

dayjs.extend(isSameOrBefore);

export const formatDate = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatDateDisplay = (date: string): string => {
  return dayjs(date).format('MMM DD, YYYY');
};

export const isDateInRange = (date: string, start: string, end: string): boolean => {
  const checkDate = dayjs(date);
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  
  return checkDate.isAfter(startDate.subtract(1, 'day')) && 
         checkDate.isBefore(endDate.add(1, 'day'));
};

export const checkBookingConflict = (
  newCheckIn: string,
  newCheckOut: string,
  existingBookings: Booking[],
  excludeId?: string
): boolean => {
  const newStart = dayjs(newCheckIn);
  const newEnd = dayjs(newCheckOut);

  return existingBookings.some(booking => {
    if (excludeId && booking.id === excludeId) return false;
    
    const existingStart = dayjs(booking.checkIn);
    const existingEnd = dayjs(booking.checkOut);
    
    // Check for overlap
    return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
  });
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  return dayjs(checkOut).diff(dayjs(checkIn), 'day');
};

export const getMonthBookings = (bookings: Booking[], month: number, year: number): Booking[] => {
  return bookings.filter(booking => {
    const checkInDate = dayjs(booking.checkIn);
    return checkInDate.month() === month && checkInDate.year() === year;
  });
};

export const isToday = (date: string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const getCalendarDates = (month: number, year: number) => {
  const startOfMonth = dayjs().year(year).month(month).startOf('month');
  const endOfMonth = dayjs().year(year).month(month).endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');
  
  const dates = [];
  let currentDate = startOfCalendar;
  
  while (currentDate.isBefore(endOfCalendar) || currentDate.isSame(endOfCalendar)) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }
  
  return dates;
};