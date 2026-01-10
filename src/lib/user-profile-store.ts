
import { create } from 'zustand';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type SocialLinks = {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  website?: string;
};

type UserProfileState = {
  trailName: string;
  description: string;
  avatar: string;
  about: string;
  hiking: boolean;
  badges: string[];
  lastActivity: string;
  responseRate: number;
  gallery: typeof PlaceHolderImages;
  reviews: { id: string; author: string; rating: number; comment: string; date: string }[];
  socials: SocialLinks;
  position: { lat: number; lng: number };
  status: string;
  services: string[];
  bedCount: number;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isPrivate: boolean;
  };
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  emergencyContacts: { name: string; relationship: string; phone: string }[];
  setProfile: (data: Partial<Omit<UserProfileState, 'address' | 'position'>>) => void;
  setService: (service: string, checked: boolean) => void;
  setBedCount: (count: number) => void;
  setAddress: (address: Partial<UserProfileState['address']>) => void;
  setContact: (contact: Partial<UserProfileState['contact']>) => void;
  setSocials: (socials: Partial<UserProfileState['socials']>) => void;
  setPosition: (position: { lat: number; lng: number }) => void;
};

const useUserProfileStore = create<UserProfileState>((set, get) => ({
  trailName: '',
  description: "PCT Class of '24",
  avatar: "https://picsum.photos/seed/123/200/200",
  about: "Just a hiker trying to make it from Mexico to Canada. I love meeting new people and sharing trail stories. Always on the lookout for good coffee and a place to charge my power bank.",
  hiking: true,
  badges: ['Thru-Hiker', 'Triple Crowner Aspirant'],
  lastActivity: 'Active now',
  responseRate: 98,
  gallery: [],
  reviews: [
      { id: 'r-1-1', author: 'Bighorn Betty', rating: 5, comment: 'Wired was a respectful and tidy guest. A joy to host!', date: '2023-05-10' },
      { id: 'r-1-2', author: 'Cascade Dave', rating: 5, comment: 'Great conversation. Left the place cleaner than they found it.', date: '2023-08-02' },
  ],
  socials: {},
  position: { lat: 34.2, lng: -117.8 },
  status: 'hiking',
  services: [],
  bedCount: 0,
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isPrivate: false,
  },
  contact: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  },
  emergencyContacts: [],

  setProfile: (data) => set((state) => ({ ...state, ...data })),
  
  setService: (serviceId, checked) => {
    set(state => ({
      services: checked 
        ? [...state.services, serviceId]
        : state.services.filter(id => id !== serviceId)
    }))
  },

  setBedCount: (count) => set({ bedCount: count }),

  setAddress: (address) => {
    set(state => ({ 
      address: { ...state.address, ...address }
    }));
    // When address changes, you might want to geocode it to update position.
    // This is a placeholder for that logic.
    // For now, let's set a mock position update.
    if (address.city?.toLowerCase() === 'wrightwood') {
        get().setPosition({ lat: 34.363, lng: -117.633 });
    }
  },
  
  setContact: (contact) => set(state => ({ contact: { ...state.contact, ...contact }})),
  
  setSocials: (socials) => set(state => ({ socials: { ...state.socials, ...socials }})),

  setPosition: (position) => set({ position }),
}));

export { useUserProfileStore };
