import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {CityName} from '../types/location.js';
import {Amenity, HousingType, Offer} from '../types/offer.js';
import {UserType} from '../types/user.js';

function parseOffer(line: string): Offer {
  const fields = line.split('\t');
  if (fields.length !== 21) {
    throw new Error(`Ожидалось 21 поле, получено ${fields.length}`);
  }

  const [title, description, date, city, previewImage, photos, premium, favorite,
    rating, housingType, bedrooms, maxAdults, price, amenities, name, email,
    avatar, password, userType, latitude, longitude] = fields;

  return {
    title,
    description,
    publishedAt: new Date(date),
    city: city as CityName,
    previewImage,
    images: photos.split(';'),
    isPremium: premium === 'true',
    isFavorite: favorite === 'true',
    rating: Number(rating),
    housingType: housingType as HousingType,
    bedrooms: Number(bedrooms),
    maxAdults: Number(maxAdults),
    price: Number(price),
    amenities: amenities.split(';') as Amenity[],
    author: {name, email, avatar: avatar || undefined, password, type: userType as UserType},
    commentCount: 0,
    location: {latitude: Number(latitude), longitude: Number(longitude)},
  };
}

export async function* readOffers(filePath: string): AsyncGenerator<Offer> {
  const lines = createInterface({input: createReadStream(filePath), crlfDelay: Infinity});
  let lineNumber = 0;
  for await (const line of lines) {
    lineNumber++;
    try {
      yield parseOffer(line);
    } catch (error) {
      throw new Error(`Строка ${lineNumber}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
