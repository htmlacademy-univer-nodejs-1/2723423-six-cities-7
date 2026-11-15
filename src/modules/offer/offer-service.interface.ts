import {HydratedDocument, Types} from 'mongoose';
import {CityName} from '../../types/location.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferDocument} from './offer.model.js';

export interface OfferServiceInterface {
  findById(id: string): Promise<HydratedDocument<OfferDocument> | null>;
  findMany(limit?: number): Promise<HydratedDocument<OfferDocument>[]>;
  findPremium(city: CityName): Promise<HydratedDocument<OfferDocument>[]>;
  create(offer: CreateOfferDto, authorId: Types.ObjectId): Promise<HydratedDocument<OfferDocument>>;
  updateById(id: string, authorId: Types.ObjectId, dto: UpdateOfferDto): Promise<HydratedDocument<OfferDocument> | null>;
  deleteById(id: string, authorId: Types.ObjectId): Promise<HydratedDocument<OfferDocument> | null>;
}
