import type { TrailAngel, Service, RadioMessage } from './types';
import {
  Car,
  Bath,
  BedDouble,
  Sofa,
  Tent,
  CookingPot,
  Lock,
  Package,
  WashingMachine,
  Wifi,
} from 'lucide-react';
import { PCT_TRACK } from './pct-track';
import { AT_TRACK } from './at-track';
import { CDT_TRACK } from './cdt-track';

export const ALL_SERVICES: Service[] = [
  { id: 'rides', name: 'Rides', icon: Car },
  { id: 'bathroom', name: 'Bathroom', icon: Bath },
  { id: 'room', name: 'Room', icon: BedDouble, associatedServices: ['private-room', 'bed'] },
  { id: 'couch-floor', name: 'Couch/Floor', icon: Sofa },
  { id: 'camping', name: 'Camping', icon: Tent },
  { id: 'kitchen', name: 'Kitchen', icon: CookingPot, associatedServices: ['kitchen', 'meals'] },
  { id: 'storage', name: 'Storage', icon: Lock, associatedServices: ['secure-storage'] },
  { id: 'packages', name: 'Packages', icon: Package, associatedServices: ['deliveries'] },
  { id: 'laundry', name: 'Laundry', icon: WashingMachine },
  { id: 'wifi', name: 'WiFi', icon: Wifi },
];

export const TRAIL_ANGELS: TrailAngel[] = [
  {
    id: 'ta-1',
    name: 'Bighorn Betty',
    location: 'Wrightwood, CA',
    position: { lat: 34.363, lng: -117.633 },
    services: ['rides', 'meals', 'secure-storage', 'deliveries', 'wifi'],
    donationExpected: true,
    about: 'Been helping PCT hikers for over 15 years. My place is your place. Got two friendly dogs and a cat. I make a mean chili, so come hungry!',
    gallery: [
      'https://picsum.photos/seed/101/600/400',
      'https://picsum.photos/seed/102/600/400',
      'https://picsum.photos/seed/103/600/400',
    ],
    badges: ['PCT Veteran', '15+ Years of Service'],
    reviews: [
      { id: 'r-1-1', author: 'Guthook', rating: 5, comment: 'Betty is a legend. Her hospitality is unmatched.', date: '2023-05-10' },
      { id: 'r-1-2', author: 'Trail Mix', rating: 5, comment: 'Amazing stay! The chili is real.', date: '2023-06-02' },
    ],
    availability: [new Date('2024-07-20'), new Date('2024-07-21'), new Date('2024-08-01')],
    verified: true,
    lastActivity: '2 hours ago',
    responseRate: 95,
    hiking: false,
    socials: {
      twitter: 'bighornbetty',
      instagram: 'bighornbetty',
    },
  },
  {
    id: 'ta-2',
    name: 'Cascade Dave',
    location: 'Cascade Locks, OR',
    position: { lat: 45.666, lng: -121.892 },
    services: ['private-room', 'bed', 'couch-floor', 'laundry', 'wifi', 'kitchen'],
    donationExpected: false,
    about: 'I have a spare room and a comfy couch right near the Bridge of the Gods. Happy to help hikers rest up before tackling Washington. I work from home, so I\'m usually around.',
    gallery: [
      'https://picsum.photos/seed/104/600/400',
      'https://picsum.photos/seed/105/600/400',
    ],
    badges: ['Bridge of the Gods Guardian'],
    reviews: [
      { id: 'r-2-1', author: 'Pacer', rating: 5, comment: 'Dave is awesome. Super clean place and a great guy to talk to.', date: '2023-08-15' },
    ],
    availability: Array.from({ length: 10 }, (_, i) => new Date(2024, 6, 25 + i)),
    verified: true,
    lastActivity: 'Online now',
    responseRate: 100,
    hiking: false,
    socials: {
      instagram: 'cascadedave',
    },
  },
  {
    id: 'ta-3',
    name: 'Scout & Frodo',
    location: 'San Diego, CA',
    position: { lat: 32.7157, lng: -117.1611 },
    services: ['bed', 'meals', 'deliveries', 'rides'],
    donationExpected: false,
    about: 'We provide a comprehensive kickoff for PCT hikers starting their journey. We can host a large number of hikers. Please contact us well in advance!',
    gallery: [
      'https://picsum.photos/seed/106/600/400',
      'https://picsum.photos/seed/107/600/400',
      'https://picsum.photos/seed/108/600/400',
    ],
    badges: ['PCT Kickoff Hosts'],
    reviews: [
      { id: 'r-3-1', author: 'Every Hiker Ever', rating: 5, comment: 'The best way to start the PCT. They have everything figured out.', date: '2023-04-20' },
      { id: 'r-3-2', author: 'Nemo', rating: 5, comment: 'Incredibly organized and welcoming.', date: '2023-04-22' },
    ],
    availability: [],
    verified: true,
    lastActivity: '1 day ago',
    responseRate: 80,
    hiking: true,
  },
  {
    id: 'ta-4',
    name: 'AT Annie',
    location: 'Damascus, VA',
    position: { lat: 36.634, lng: -81.785 },
    services: ['camping', 'bathroom', 'wifi', 'laundry'],
    donationExpected: true,
    about: 'Got a big backyard perfect for tents, right in the heart of Trail Town USA. Come relax during Trail Days or any time you\'re passing through. I can also do shuttles to the trailhead.',
    gallery: [
      'https://picsum.photos/seed/109/600/400',
    ],
    badges: ['Trail Days Local'],
    reviews: [
      { id: 'r-4-1', author: 'Mudfoot', rating: 4, comment: 'Great spot to camp, and Annie is super friendly.', date: '2023-05-14' },
    ],
    availability: Array.from({ length: 30 }, (_, i) => new Date(2024, 7, 1 + i)),
    verified: false,
    lastActivity: '3 days ago',
    responseRate: 70,
    hiking: false,
    socials: {
      twitter: 'at_annie',
    },
  },
    {
    id: 'ta-5',
    name: 'CDT Chris',
    location: 'Leadville, CO',
    position: { lat: 39.244, lng: -106.292 },
    services: ['private-room', 'meals', 'rides', 'wifi'],
    donationExpected: false,
    about: 'High-altitude hospitality! I have a spare room for CDT hikers needing to acclimatize or resupply in Leadville. I\'m an avid mountaineer myself and can offer advice on the local sections.',
    gallery: [
      'https://picsum.photos/seed/110/600/400',
      'https://picsum.photos/seed/111/600/400',
    ],
    badges: ['10k+ Feet Club', 'Mountaineer'],
    reviews: [
      { id: 'r-5-1', author: 'Switchback', rating: 5, comment: 'Chris knows his stuff! The room was perfect and his advice was invaluable for the Collegiates.', date: '2023-07-22' },
      { id: 'r-5-2', author: 'Rocky', rating: 5, comment: 'Felt like staying with a friend. Great food, great company.', date: '2023-07-25' },
    ],
    availability: [new Date('2024-07-28'), new Date('2024-07-29'), new Date('2024-08-05'), new Date('2024-08-06'), new Date('2024-08-10')],
    verified: true,
    lastActivity: 'Active this week',
    responseRate: 98,
    hiking: false,
  },
];


export const RADIO_MESSAGES: RadioMessage[] = [
    {
        id: 'rm-1',
        authorId: 'user-wired',
        author: 'Wired',
        message: 'Anyone know the water situation at mile 179? Heading north.',
        timestamp: '2024-07-15T08:30:00Z',
    },
    {
        id: 'rm-2',
        authorId: 'ta-1',
        author: 'Bighorn Betty',
        message: 'Heads up! Bear sighting near Bear Mountain, mile 1375. Looks like a mama with cubs, keep your distance.',
        timestamp: '2024-07-15T10:12:00Z',
    },
    {
        id: 'rm-3',
        authorId: 'user-poptart',
        author: 'Poptart',
        message: 'Left a full fuel canister in the hiker box at Paradise Valley Cafe. Enjoy!',
        timestamp: '2024-07-15T11:05:00Z',
    },
    {
        id: 'rm-4',
        authorId: 'user-glimmer',
        author: 'Glimmer',
        message: 'Looking to split a ride from Kennedy Meadows to Bishop on the 20th. Anyone interested?',
        timestamp: '2024-07-15T14:22:00Z',
    }
];

export const TRAILS = {
    pct: {
        name: 'Pacific Crest Trail',
        track: PCT_TRACK,
        color: '#286ff2' // Blue
    },
    at: {
        name: 'Appalachian Trail',
        track: AT_TRACK,
        color: '#286ff2' // Blue
    },
    cdt: {
        name: 'Continental Divide Trail',
        track: CDT_TRACK,
        color: '#286ff2' // Blue
    }
}
