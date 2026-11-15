import {Offer} from '../../../types/offer.js';

export type CreateOfferDto = Omit<Offer, 'author' | 'rating' | 'commentCount' | 'isFavorite'>;
