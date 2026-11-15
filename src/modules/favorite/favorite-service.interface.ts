import {HydratedDocument, Types} from 'mongoose';
import {CreateFavoriteDto} from './dto/create-favorite.dto.js';
import {FavoriteDocument} from './favorite.model.js';
import {OfferDocument} from '../offer/offer.model.js';

export interface FavoriteServiceInterface {
  findForUser(userId: Types.ObjectId): Promise<HydratedDocument<OfferDocument>[]>;
  has(userId: Types.ObjectId, offerId: Types.ObjectId): Promise<boolean>;
  add(dto: CreateFavoriteDto): Promise<HydratedDocument<FavoriteDocument> | null>;
  remove(userId: Types.ObjectId, offerId: Types.ObjectId): Promise<boolean>;
}
