import {inject, injectable} from 'inversify';
import {HydratedDocument, Model, Types} from 'mongoose';
import {OfferModelToken} from '../../container.types.js';
import {Offer} from '../../types/offer.js';
import {OfferDocument} from './offer.model.js';
import {OfferServiceInterface} from './offer-service.interface.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(@inject(OfferModelToken) private readonly offerModel: Model<OfferDocument>) {}

  public async findById(id: string): Promise<HydratedDocument<OfferDocument> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async create(offer: Offer, authorId: Types.ObjectId): Promise<HydratedDocument<OfferDocument>> {
    return this.offerModel.create({...offer, author: authorId});
  }
}
