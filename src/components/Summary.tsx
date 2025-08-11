import React, { useState, useMemo } from 'react';
import { BarChart3, ChevronDown, ChevronRight, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Booking } from '../types';
import { calculateBookingStats } from '../utils/bookingUtils';

interface SummaryProps {
  bookings: Booking[];
}

export const Summary: React.FC<SummaryProps> = ({ bookings }) => {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  
  const stats = useMemo(() => calculateBookingStats(bookings), [bookings]);
  
  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const totalStats = useMemo(() => {
    let totalBookings = 0;
    let totalNights = 0;
    let totalRevenue = 0;
    
    Object.values(stats).forEach(yearData => {
      Object.values(yearData).forEach(monthData => {
        totalBookings += monthData.bookings;
        totalNights += monthData.nights;
        totalRevenue += monthData.revenue;
      });
    });
    
    return { totalBookings, totalNights, totalRevenue };
  }, [stats]);

  if (Object.keys(stats).length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Business Summary</h2>
        </div>
        
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No data available</h3>
          <p className="text-gray-400">Start adding bookings to see your business summary.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Business Summary</h2>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-purple-800">{totalStats.totalBookings}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Nights</p>
              <p className="text-2xl font-bold text-blue-800">{totalStats.totalNights}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-800">₹{totalStats.totalRevenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Yearly Breakdown */}
      <div className="space-y-4">
        {Object.entries(stats)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([year, yearData]) => {
            const isExpanded = expandedYears.has(year);
            const yearTotal = Object.values(yearData).reduce(
              (acc, month) => ({
                bookings: acc.bookings + month.bookings,
                nights: acc.nights + month.nights,
                revenue: acc.revenue + month.revenue
              }),
              { bookings: 0, nights: 0, revenue: 0 }
            );

            return (
              <div key={year} className="bg-white rounded-lg shadow-md border border-gray-200">
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">{year}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-600">
                      <strong>{yearTotal.bookings}</strong> bookings
                    </span>
                    <span className="text-gray-600">
                      <strong>{yearTotal.nights}</strong> nights
                    </span>
                    <span className="text-gray-600">
                      <strong>₹{yearTotal.revenue}</strong> revenue
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(yearData)
                        .sort(([a], [b]) => {
                          const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                                            'July', 'August', 'September', 'October', 'November', 'December'];
                          return monthOrder.indexOf(a) - monthOrder.indexOf(b);
                        })
                        .map(([month, data]) => (
                          <div key={month} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">{month}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bookings:</span>
                                <span className="font-medium">{data.bookings}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Nights:</span>
                                <span className="font-medium">{data.nights}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Revenue:</span>
                                <span className="font-medium text-green-600">₹{data.revenue}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};