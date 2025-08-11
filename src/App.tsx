import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, Search as SearchIcon, BarChart3, Home, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import dayjs from 'dayjs';
import { useBookings } from './hooks/useBookings';
import { BookingForm } from './components/BookingForm';
import { Calendar } from './components/Calendar';
import { BookingsList } from './components/BookingsList';
import { Search } from './components/Search';
import { Summary } from './components/Summary';

type TabType = 'new' | 'calendar' | 'upcoming' | 'search' | 'last-month' | 'current-month' | 'next-month' | 'summary';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { bookings, loading, addBooking } = useBookings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-700">Loading your rental manager...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'new' as TabType, label: 'New Booking', icon: Plus },
    { id: 'calendar' as TabType, label: 'Calendar', icon: CalendarIcon },
    { id: 'upcoming' as TabType, label: 'Upcoming', icon: Clock },
    { id: 'search' as TabType, label: 'Search', icon: SearchIcon },
    { id: 'last-month' as TabType, label: 'Last Month', icon: ChevronLeft },
    { id: 'current-month' as TabType, label: 'Current Month', icon: Home },
    { id: 'next-month' as TabType, label: 'Next Month', icon: ChevronRight },
    { id: 'summary' as TabType, label: 'Summary', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return <BookingForm bookings={bookings} onAddBooking={addBooking} />;
      case 'calendar':
        return <Calendar bookings={bookings} />;
      case 'upcoming':
        return (
          <BookingsList
            bookings={bookings}
            title="Upcoming Bookings"
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            period="upcoming"
          />
        );
      case 'search':
        return <Search bookings={bookings} />;
      case 'last-month':
        return (
          <BookingsList
            bookings={bookings}
            title={`${dayjs().subtract(1, 'month').format('MMMM YYYY')} Bookings`}
            icon={<ChevronLeft className="w-6 h-6 text-purple-600" />}
            period="last"
          />
        );
      case 'current-month':
        return (
          <BookingsList
            bookings={bookings}
            title={`${dayjs().format('MMMM YYYY')} Bookings`}
            icon={<Home className="w-6 h-6 text-purple-600" />}
            period="current"
          />
        );
      case 'next-month':
        return (
          <BookingsList
            bookings={bookings}
            title={`${dayjs().add(1, 'month').format('MMMM YYYY')} Bookings`}
            icon={<ChevronRight className="w-6 h-6 text-purple-600" />}
            period="next"
          />
        );
      case 'summary':
        return <Summary bookings={bookings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  Weekend Property Rental Manager
                </h1>
                <p className="text-sm text-gray-600">Premium Property Management System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg border border-purple-200">
              <div className="text-center">
                <p className="text-xs text-purple-600">Total Bookings</p>
                <p className="font-semibold text-purple-800">{bookings.length}</p>
              </div>
              <div className="w-px h-8 bg-purple-200"></div>
              <div className="text-center">
                <p className="text-xs text-purple-600">This Month</p>
                <p className="font-semibold text-purple-800">
                  {bookings.filter(b => dayjs(b.checkIn).month() === dayjs().month()).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabData?.icon || Menu;
                  return (
                    <>
                      <Icon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800">{activeTabData?.label}</span>
                    </>
                  );
                })()}
              </div>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
                <div className="max-w-7xl mx-auto px-4 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`
                            flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                            ${isActive
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                              : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50 border border-gray-200'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Weekend Property Rental Manager. Professional property management made simple.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Built for property supervisors and managers</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Active</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;