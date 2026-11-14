import {model, Schema, Types} from 'mongoose';
import {CityName, Location} from '../../types/location.js';
import {Amenity, HousingType} from '../../types/offer.js';

export type OfferDocument = {
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
  author: Types.ObjectId;
  commentCount: number;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
};

const offerSchema = new Schema<OfferDocument>({
  title: {type: String, required: true},
  description: {type: String, required: true},
  publishedAt: {type: Date, required: true},
  city: {type: String, required: true},
  previewImage: {type: String, required: true},
  images: {type: [String], required: true},
  isPremium: {type: Boolean, required: true},
  isFavorite: {type: Boolean, required: true},
  rating: {type: Number, required: true},
  housingType: {type: String, required: true},
  bedrooms: {type: Number, required: true},
  maxAdults: {type: Number, required: true},
  price: {type: Number, required: true},
  amenities: {type: [String], required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  commentCount: {type: Number, default: 0},
  location: {
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
  },
}, {timestamps: true, collection: 'offers'});

export const OfferModel = model<OfferDocument>('Offer', offerSchema);
