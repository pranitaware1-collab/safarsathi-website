import { Destination } from './types';

export const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Varkala Beach',
    category: 'Beaches',
    image: 'https://picsum.photos/seed/varkala/800/600',
    description: 'A stunning cliffside beach in Kerala with golden sands and spiritual vibes.',
    longDescription: 'Varkala Beach, also known as Papanasham Beach, is a stunning stretch of sand located in the Thiruvananthapuram district of Kerala. It is unique for its high cliffs that border the Arabian Sea. The beach is famous for its natural mineral springs and the ancient Janardhana Swami Temple nearby.',
    budgetEstimate: '₹15,000 - ₹30,000',
    bestTimeToVisit: 'October to March',
    nearbyHotels: ['The Gateway Hotel', 'Clafouti Beach Resort', 'Zostel Varkala'],
    nearbyRestaurants: ['Darjeeling Cafe', 'Abba Restaurant', 'Coffee Temple'],
    coordinates: { lat: 8.7333, lng: 76.7100 },
    itinerary: [
      { day: 1, activities: ['Arrival and check-in', 'Evening walk on the cliff', 'Dinner at Darjeeling Cafe'] },
      { day: 2, activities: ['Morning yoga session', 'Beach relaxation', 'Visit Janardhana Swami Temple'] },
      { day: 3, activities: ['Boating in nearby backwaters', 'Shopping at cliff markets', 'Sunset at the beach'] }
    ]
  },
  {
    id: '2',
    name: 'Manali',
    category: 'Mountains',
    image: 'https://picsum.photos/seed/manali/800/600',
    description: 'A high-altitude Himalayan resort town known for its cool climate and snow-capped peaks.',
    longDescription: 'Manali is a high-altitude Himalayan resort town in India’s northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination. Set on the Beas River, it’s a gateway for skiing in the Solang Valley and trekking in Parvati Valley. It’s also a jump-off point for paragliding, rafting and mountaineering in the Pir Panjal mountains.',
    budgetEstimate: '₹20,000 - ₹45,000',
    bestTimeToVisit: 'March to June',
    nearbyHotels: ['The Himalayan', 'Span Resort and Spa', 'Manu Allaya'],
    nearbyRestaurants: ['Cafe 1947', 'Johnson’s Cafe', 'Chopsticks'],
    coordinates: { lat: 32.2432, lng: 77.1892 },
    itinerary: [
      { day: 1, activities: ['Arrival and local market exploration', 'Visit Hadimba Devi Temple', 'Dinner at Old Manali'] },
      { day: 2, activities: ['Full day trip to Solang Valley', 'Adventure sports (Paragliding/Skiing)', 'Evening at Mall Road'] },
      { day: 3, activities: ['Visit Vashisht Hot Springs', 'Jogini Waterfalls trek', 'Departure'] }
    ]
  },
  {
    id: '3',
    name: 'Hampi',
    category: 'Historical Places',
    image: 'https://picsum.photos/seed/hampi/800/600',
    description: 'An ancient village dotted with numerous ruined temple complexes from the Vijayanagara Empire.',
    longDescription: 'Hampi is an ancient village in the south Indian state of Karnataka. It’s dotted with numerous ruined temple complexes from the Vijayanagara Empire. On the south bank of the River Tungabhadra is the 7th-century Hindu Virupaksha Temple, near the revived Hampi Bazaar. A carved stone chariot stands in front of the huge Vittala Temple site.',
    budgetEstimate: '₹10,000 - ₹25,000',
    bestTimeToVisit: 'October to February',
    nearbyHotels: ['Evolve Back Hampi', 'Heritage Resort Hampi', 'Hampi’s Whispers'],
    nearbyRestaurants: ['Mango Tree', 'Laughing Buddha', 'Chillout Cafe'],
    coordinates: { lat: 15.3350, lng: 76.4600 }
  },
  {
    id: '4',
    name: 'Jaipur',
    category: 'Cities',
    image: 'https://picsum.photos/seed/jaipur/800/600',
    description: 'The Pink City of India, known for its majestic palaces, forts, and vibrant markets.',
    longDescription: 'Jaipur is the capital of India’s Rajasthan state. It evokes the royal family that once ruled the region and that, in 1727, founded what is now called the Old City, or “Pink City” for its trademark building color. At the center of its stately street grid (unique in India) stands the opulent, colonnaded City Palace complex.',
    budgetEstimate: '₹15,000 - ₹40,000',
    bestTimeToVisit: 'November to February',
    nearbyHotels: ['Rambagh Palace', 'ITC Rajputana', 'Fairmont Jaipur'],
    nearbyRestaurants: ['Tapri Central', 'Rawat Mishthan Bhandar', 'LMB'],
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  {
    id: '5',
    name: 'Varanasi',
    category: 'Religious Places',
    image: 'https://picsum.photos/seed/varanasi/800/600',
    description: 'One of the oldest living cities in the world, famous for its spiritual ghats and temples.',
    longDescription: 'Varanasi is a city in the northern Indian state of Uttar Pradesh dating to the 11th century B.C. Regarded as the spiritual capital of India, the city draws Hindu pilgrims who bathe in the Ganges River’s sacred waters and perform funeral rites. Along the city’s winding streets are some 2,000 temples, including Kashi Vishwanath, the “Golden Temple,” dedicated to the Hindu god Shiva.',
    budgetEstimate: '₹8,000 - ₹20,000',
    bestTimeToVisit: 'October to March',
    nearbyHotels: ['BrijRama Palace', 'Taj Ganges', 'Radisson Hotel'],
    nearbyRestaurants: ['Blue Lassi', 'Kashi Chat Bhandar', 'Dosa Cafe'],
    coordinates: { lat: 25.3176, lng: 82.9739 }
  }
];

export const CATEGORIES = [
  'Beaches', 'Mountains', 'Historical Places', 'Cities', 'Religious Places'
] as const;
