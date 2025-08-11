import React, { useState } from 'react';
import { CalendarDays, Users, Phone, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { Booking } from '../types';
import { generateBookingId, isRepeatCustomer, getCustomerHistory } from '../utils/bookingUtils';
import { checkBookingConflict } from '../utils/dateUtils';

interface BookingFormProps {
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ bookings, onAddBooking }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    checkIn: '',
    checkOut: '',
    guestCount: 1,
    bookingType: 'family' as 'bachelors' | 'family',
    totalAmount: 0,
    advanceAmount: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Phone number must be exactly 10 digits';
    }
    
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    } else if (formData.checkIn && dayjs(formData.checkOut).isSameOrBefore(dayjs(formData.checkIn))) {
      newErrors.checkOut = 'Check-out must be after check-in date';
    }
    
    if (formData.guestCount < 1) {
      newErrors.guestCount = 'Guest count must be at least 1';
    }
    
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Total amount must be greater than 0';
    }
    
    if (formData.advanceAmount < 0 || formData.advanceAmount > formData.totalAmount) {
      newErrors.advanceAmount = 'Advance amount must be between 0 and total amount';
    }
    
    // Check for booking conflicts
    if (formData.checkIn && formData.checkOut) {
      const hasConflict = checkBookingConflict(
        formData.checkIn, 
        formData.checkOut, 
        bookings
      );
      
      if (hasConflict) {
        newErrors.checkIn = 'These dates conflict with an existing booking';
        newErrors.checkOut = 'These dates conflict with an existing booking';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newBooking: Booking = {
        id: generateBookingId(),
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestCount: formData.guestCount,
        bookingType: formData.bookingType,
        totalAmount: formData.totalAmount,
        advanceAmount: formData.advanceAmount,
        balanceAmount: formData.totalAmount - formData.advanceAmount,
        createdAt: dayjs().toISOString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onAddBooking(newBooking);
      
      setFormData({
        customerName: '',
        customerPhone: '',
        checkIn: '',
        checkOut: '',
        guestCount: 1,
        bookingType: 'family',
        totalAmount: 0,
        advanceAmount: 0
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isRepeat = formData.customerPhone.trim().length === 10 && 
                  isRepeatCustomer(formData.customerPhone.trim(), bookings);
  
  const customerHistory = formData.customerPhone.trim().length === 10 ? 
                         getCustomerHistory(formData.customerPhone.trim(), bookings) : 
                         { totalBookings: 0, totalNights: 0 };

  return (
    <div className="max-w-2xl mx-auto">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Booking created successfully!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.customerName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="10-digit phone number"
                maxLength={10}
              />
            </div>
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
            )}
            {isRepeat && (
              <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                <p className="text-sm text-purple-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Repeat Customer: {customerHistory.totalBookings} previous bookings, 
                  {customerHistory.totalNights} total nights
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date *
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.checkIn ? 'border-red-300' : 'border-gray-300'
                }`}
                min={dayjs().format('YYYY-MM-DD')}
              />
            </div>
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date *
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.checkOut ? 'border-red-300' : 'border-gray-300'
                }`}
                min={formData.checkIn || dayjs().format('YYYY-MM-DD')}
              />
            </div>
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guest Count *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.guestCount}
                onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 1)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.guestCount ? 'border-red-300' : 'border-gray-300'
                }`}
                min="1"
              />
            </div>
            {errors.guestCount && (
              <p className="mt-1 text-sm text-red-600">{errors.guestCount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Type *
            </label>
            <select
              value={formData.bookingType}
              onChange={(e) => handleInputChange('bookingType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="family">Family Stay</option>
              <option value="bachelors">Bachelor Party</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount (₹) *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.totalAmount || ''}
                onChange={(e) => handleInputChange('totalAmount', parseInt(e.target.value) || 0)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.totalAmount ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
                placeholder="Enter total amount"
              />
            </div>
            {errors.totalAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advance Amount (₹) *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.advanceAmount || ''}
                onChange={(e) => handleInputChange('advanceAmount', parseInt(e.target.value) || 0)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.advanceAmount ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
                max={formData.totalAmount}
                placeholder="Enter advance amount"
              />
            </div>
            {errors.advanceAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.advanceAmount}</p>
            )}
          </div>
        </div>

        {formData.totalAmount > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Balance Amount: <span className="font-semibold text-orange-600">
                ₹{formData.totalAmount - formData.advanceAmount}
              </span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating Booking...
            </>
          ) : (
            'Create Booking'
          )}
        </button>
      </form>
    </div>
  );
};