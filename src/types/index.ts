export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  bookingType: 'bachelors' | 'family';
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  createdAt: string;
}

export interface CustomerHistory {
  totalBookings: number;
  totalNights: number;
}

export interface MonthlySummary {
  bookings: number;
  nights: number;
  revenue: number;
}

export interface YearlySummary {
  [month: string]: MonthlySummary;
}

export interface BookingStats {
  [year: string]: YearlySummary;
}