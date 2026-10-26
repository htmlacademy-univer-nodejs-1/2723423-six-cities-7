import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import axios from 'axios';
import {MockOffer} from '../types/mock-offer.js';
import {Offer} from '../types/offer.js';

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[randomInteger(0, items.length - 1)];
}

function makeOffer(template: MockOffer): Offer {
  const daysAgo = randomInteger(0, 7);
  const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    ...template,
    publishedAt,
    isPremium: Math.random() < 0.5,
    isFavorite: Math.random() < 0.5,
    rating: randomInteger(10, 50) / 10,
    bedrooms: randomInteger(1, 8),
    maxAdults: randomInteger(1, 10),
    price: randomInteger(100, 100000),
    commentCount: 0,
  };
}

function toTsv(offer: Offer): string {
  return [
    offer.title, offer.description, offer.publishedAt.toISOString(), offer.city,
    offer.previewImage, offer.images.join(';'), offer.isPremium, offer.isFavorite,
    offer.rating, offer.housingType, offer.bedrooms, offer.maxAdults, offer.price,
    offer.amenities.join(';'), offer.author.name, offer.author.email,
    offer.author.avatar ?? '', offer.author.password, offer.author.type,
    offer.location.latitude, offer.location.longitude,
  ].join('\t');
}

export async function generateOffers(count: number, filePath: string, url: string): Promise<void> {
  const response = await axios.get<MockOffer[]>(url);
  const templates = response.data;
  if (!Array.isArray(templates) || templates.length === 0) {
    throw new Error('JSON-сервис не вернул заготовки предложений');
  }

  async function* rows(): AsyncGenerator<string> {
    for (let i = 0; i < count; i++) {
      yield `${toTsv(makeOffer(randomItem(templates)))}\n`;
    }
  }

  await pipeline(rows(), createWriteStream(filePath));
}
