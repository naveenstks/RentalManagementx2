import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter, CheckCircle } from 'lucide-react';
import { Booking } from '../types';
import { searchBookings, getCustomerHistory } from '../utils/bookingUtils';
import { BookingCard } from './BookingCard';

interface SearchProps {
  bookings: Booking[];
}

export const Search: React.FC<SearchProps> = ({ bookings }) => {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const searchResults = useMemo(() => {
    return searchBookings(bookings, query);
  }, [bookings, query]);

  const handleCopyDetails = (bookingId: string) => {
    setCopiedId(bookingId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <SearchIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Search Bookings</h2>
        </div>
        
        <div className="relative max-w-lg">
          <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, booking ID, or dates (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD)..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        {query && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Found {searchResults.length} booking{searchResults.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {copiedId && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">Booking details copied to clipboard!</span>
        </div>
      )}

      {query && searchResults.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No results found</h3>
          <p className="text-gray-400">Try searching with a different term or date format.</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Start searching</h3>
          <p className="text-gray-400">Enter a customer name, phone number, booking ID, or date to find bookings.</p>
        </div>
      )}

      {query && searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(booking => {
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