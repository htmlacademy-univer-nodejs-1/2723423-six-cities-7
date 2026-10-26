import {CityName, Location} from './location.js';
import {User} from './user.js';

export enum HousingType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
}

export enum Amenity {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export type Offer = {
  title: string;
  description: string;
  publishedAt: Date;
  city: CityName;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentCount: number;
  location: Location;
};
