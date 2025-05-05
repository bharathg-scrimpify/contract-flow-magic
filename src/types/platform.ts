
import { User } from "firebase/auth";

export type UserRole = 'individual' | 'company';

export type CategoryType = 
  | 'musician' 
  | 'vocalist' 
  | 'dj' 
  | 'sound_engineer' 
  | 'lighting_technician'
  | 'dancer' 
  | 'performer' 
  | 'equipment' 
  | 'venue' 
  | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced' | 'professional';

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface RateRange {
  min: number;
  max: number;
  currency: string;
  unit: 'hour' | 'day' | 'event' | 'gig';
}

export interface TimeSlot {
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  isFlexible: boolean;
}

export interface BaseListingData {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  subCategory?: string;
  location: Location;
  timeSlots: TimeSlot[];
  rate: RateRange;
  equipmentProvided?: string[];
  requirements?: string[];
  experienceLevel?: ExperienceLevel;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID
  userType: UserRole;
  userName: string;
  userImage?: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
}

export interface NeedListing extends BaseListingData {
  type: 'need';
  contractOffered: boolean;
  contractDetails?: {
    termsAccepted: boolean;
    cancelPolicy: string;
  };
}

export interface OfferListing extends BaseListingData {
  type: 'offer';
  portfolio?: string[];
  experience?: string;
  specialSkills?: string[];
  availableDates?: string[]; // ISO strings
}

export type Listing = NeedListing | OfferListing;

export interface Bid {
  id: string;
  needId: string;
  offerId: string;
  needOwnerId: string;
  offerOwnerId: string;
  bidAmount: {
    value: number;
    currency: string;
    unit: 'hour' | 'day' | 'event' | 'gig';
  };
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'contract_created';
  createdAt: string;
  updatedAt: string;
  matchConfidence: number; // 0-100 score for how well the need and offer match
  contractId?: string;
}

export interface ProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  userType: UserRole;
  companyName?: string;
  bio?: string;
  location?: Location;
  categories?: CategoryType[];
  skills?: string[];
  portfolio?: string[];
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    soundcloud?: string;
    spotify?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  rating?: number;
  reviewCount?: number;
  memberSince: string;
  verified: boolean;
}
