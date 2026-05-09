export interface ItineraryDay {
  day: number;
  activities: string[];
  itineraryPdfUrl2?: string;
  
}

export interface Destination {
  id: string;
  name: string;
  category: 'Beaches' | 'Mountains' | 'Historical Places' | 'Cities' | 'Religious Places';
  image: string;
  description: string;
  longDescription: string;
  budgetEstimate: string;
  bestTimeToVisit: string;
  nearbyHotels: string[];
  nearbyRestaurants: string[];
  coordinates: { lat: number; lng: number };
  itinerary?: ItineraryDay[];
  itineraryPdfUrl?: string;
  tripPlanUrl?: string;
  bookingFormUrl?: string;
  itineraryPdfUrl2?: string;
googleSheetUrl?: string;
price?: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  tripName?: string;
  createdAt: string;
  isApproved: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
}
