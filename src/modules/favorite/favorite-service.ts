import {inject, injectable} from 'inversify';
import {HydratedDocument, Model, Types} from 'mongoose';
import {FavoriteModelToken, OfferModelToken} from '../../container.types.js';
import {OfferDocument} from '../offer/offer.model.js';
import {CreateFavoriteDto} from './dto/create-favorite.dto.js';
import {FavoriteDocument} from './favorite.model.js';
import {FavoriteServiceInterface} from './favorite-service.interface.js';

@injectable()
export class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(FavoriteModelToken) private readonly favoriteModel: Model<FavoriteDocument>,
    @inject(OfferModelToken) private readonly offerModel: Model<OfferDocument>,
  ) {}

  public async findForUser(userId: Types.ObjectId): Promise<HydratedDocument<OfferDocument>[]> {
    const favorites = await this.favoriteModel.find({user: userId}).select('offer').exec();
    return this.offerModel.find({_id: {$in: favorites.map((item) => item.offer)}}).sort({publishedAt: -1}).exec();
  }

  public async has(userId: Types.ObjectId, offerId: Types.ObjectId): Promise<boolean> {
    return Boolean(await this.favoriteModel.exists({user: userId, offer: offerId}));
  }

  public async add(dto: CreateFavoriteDto): Promise<HydratedDocument<FavoriteDocument> | null> {
    if (!await this.offerModel.exists({_id: dto.offerId})) {
      return null;
    }
    return this.favoriteModel.findOneAndUpdate(
      {user: dto.userId, offer: dto.offerId},
      {$setOnInsert: {user: dto.userId, offer: dto.offerId}},
      {upsert: true, new: true},
    ).exec();
  }

  public async remove(userId: Types.ObjectId, offerId: Types.ObjectId): Promise<boolean> {
    return Boolean(await this.favoriteModel.findOneAndDelete({user: userId, offer: offerId}).exec());
  }
}
