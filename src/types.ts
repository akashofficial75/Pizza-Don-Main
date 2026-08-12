export type PriceOption =
  | number
  | { [size: string]: number }; // e.g. { "8": 500, "10": 600, "12": 750 } or { "1pc": 90, "4pcs": 340 }

export interface MenuItem {
  id: string;
  name: string;
  category: string; // e.g. "Premium Pizza", "Regular Pizza", "Burger", etc.
  description: string;
  ingredients?: string;
  price: PriceOption;
  imageUrl: string;
  tags: ('Best Seller' | 'Spicy' | 'New')[];
  soldOut?: boolean;
  note?: string; // e.g. "Only available in 12\""
  orderIndex: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  orderIndex: number;
}

export interface CartItem {
  id: string; // unique cart item id (item.id + size + notes)
  menuItemId: string;
  name: string;
  price: number;
  size?: string; // e.g. "10\"", "4pcs"
  quantity: number;
  note?: string;
  category: string;
  imageUrl: string;
}

export type BookingType = 'table' | 'event';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Declined' | 'Completed';

export interface BookingRequest {
  id: string;
  bookingType: BookingType;
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "18:00" (6:00 PM)
  guests: number;
  occasion?: string;
  eventThemeRequest?: string; // specific to event/private party
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BlockedDate {
  date: string; // YYYY-MM-DD
  reason?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Food' | 'Ambiance' | 'Craft';
  imageUrl: string;
  caption: string;
}

export interface GoogleReview {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number; // 5
  timeAgo: string;
  comment: string;
  badge?: string;
}

export interface BusinessSettings {
  restaurantName: string;
  address: string;
  whatsappOrderNumber: string; // "8801729668090"
  whatsappDisplay: string; // "01729-668090"
  phoneNumber: string; // "01911-901910"
  openingHours: string; // "Open Daily, 12:00 PM – 10:00 PM"
  googleMapsEmbedUrl: string;
  heroTagline: string;
  heroSubtitle: string;
  aboutText: string;
  facebookUrl: string;
  instagramUrl: string;
  heroImageUrl?: string;
  bannerImageUrl?: string;
  siteLogoUrl?: string;
}

export interface DatabaseState {
  categories: MenuCategory[];
  items: MenuItem[];
  bookings: BookingRequest[];
  blockedDates: BlockedDate[];
  settings: BusinessSettings;
  gallery: GalleryItem[];
  reviews: GoogleReview[];
  adminSalt?: string;
  adminPasswordHash?: string;
  adminToken?: string;
}
