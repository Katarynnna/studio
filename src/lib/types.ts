import type { LucideIcon } from 'lucide-react';

export type Service = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type TrailAngel = {
  id: string;
  name: string;
  location: string;
  position: {
    lat: number;
    lng: number;
  };
  services: string[]; // Array of service IDs
  donationExpected: boolean;
  about: string;
  gallery: string[]; // Array of image URLs
  badges: string[];
  reviews: Review[];
  availability: Date[]; // Dates they are available
};

export type RadioMessage = {
  id: string;
  author: string;
  message: string;
  timestamp: string;
};
