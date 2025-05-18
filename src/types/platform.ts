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

// New Address interface based on the provided data structure
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  googlePlaceId?: string | null;
}

// New Rate interface
export interface Rate {
  durationType: number;
  rate: {
    currencyCode: string;
    value: number;
  };
  isMealIncluded: boolean;
}

// New Category interface
export interface Category {
  id: string;
  name: string;
}

// New DateRange interface
export interface DateRange {
  startDateTime: string;
  endDateTime: string;
  recurrenceRule: string;
}

// New LocationRange interface
export interface LocationRange {
  range: number;
  rangeUnit: string;
}

// New UserProfile interface
export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  gender?: string;
  birthDate?: string;
  address?: Address | null;
  aboutMe?: string;
  companyId?: string | null;
  roleId?: number;
  invitedBy?: string | null;
  isActive: boolean;
  createdBy?: string;
  createdDate: string;
  updatedDate: string;
  updatedBy?: string;
  profilePic?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileKey: string;
    createdBy: string;
    createdDate: string;
    isActive: boolean;
    entityType?: string | null;
    entityId?: string | null;
  } | null;
  coverPic?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileKey: string;
    createdBy: string;
    createdDate: string;
    isActive: boolean;
    entityType?: string | null;
    entityId?: string | null;
  } | null;
  lastSignInTimestamp?: string | null;
  profileScore?: number | null;
  companyLegalName?: string | null;
  companyBrandName?: string | null;
  stripeDetails?: {
    customerId?: string;
    connectAccountId?: string;
    subscriptionId?: string | null;
    hasActiveSubscription?: boolean;
  };
}

// New NeedTemplate interface
export interface NeedTemplate {
  id: string;
  needIdentifier: string;
  rates: Rate[];
  templateName: string;
  templateDescription: string;
  categorySelection: Category[];
  userId: string;
  dateRange: DateRange;
  locationRange: LocationRange;
  address: Address;
  isLive: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdBy?: string | null;
  createdDate: string;
  modifiedBy?: string | null;
  modifiedDate: string;
  user: UserProfile;
  canSendBid: boolean;
}

// New OfferTemplate interface
export interface OfferTemplate {
  id: string;
  offerIdentifier: string;
  rates: Rate[];
  templateName: string;
  templateDescription: string;
  categorySelection: Category[];
  userId: string;
  dateRange: DateRange;
  locationRange: LocationRange;
  address: Address;
  isLive: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdBy?: string | null;
  createdDate: string;
  modifiedBy?: string | null;
  modifiedDate: string;
  user: UserProfile;
  canSendBid: boolean;
}

// Updated Bid interface to match the provided structure
export interface Bid {
  id: string;
  bidIdentifier: string;
  bidOfferStatus: string;
  bidNeedStatus: string;
  needTemplate: NeedTemplate;
  offerTemplate: OfferTemplate;
  startDate: string;
  endDate: string;
  bidRate: Rate;
  counterBidRate?: Rate | null;
  user?: UserProfile | null;
  bidStatus: string;
  isActive: boolean;
  notes?: string | null;
  bidOrigin: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  canAcceptBid: boolean;
  canCreateContract: boolean;
  revision: number;
  
  // Let's keep these fields for compatibility with existing code
  matchConfidence?: number; // We'll calculate this or use a default
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
