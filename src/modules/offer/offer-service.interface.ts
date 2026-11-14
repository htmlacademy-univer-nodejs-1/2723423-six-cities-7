import {HydratedDocument, Types} from 'mongoose';
import {Offer} from '../../types/offer.js';
import {OfferDocument} from './offer.model.js';

export interface OfferServiceInterface {
  findById(id: string): Promise<HydratedDocument<OfferDocument> | null>;
  create(offer: Offer, authorId: Types.ObjectId): Promise<HydratedDocument<OfferDocument>>;
}
