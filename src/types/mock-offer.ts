import {CityName, Location} from './location.js';
import {Amenity, HousingType} from './offer.js';
import {User} from './user.js';

export type MockOffer = {
  title: string;
  description: string;
  city: CityName;
  previewImage: string;
  images: string[];
  housingType: HousingType;
  amenities: Amenity[];
  author: User;
  location: Location;
};
