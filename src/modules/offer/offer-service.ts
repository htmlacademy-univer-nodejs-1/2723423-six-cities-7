import {inject, injectable} from 'inversify';
import {HydratedDocument, Model, Types} from 'mongoose';
import {CommentModelToken, FavoriteModelToken, OfferModelToken} from '../../container.types.js';
import {CityName} from '../../types/location.js';
import {CommentDocument} from '../comment/comment.model.js';
import {FavoriteDocument} from '../favorite/favorite.model.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferDocument} from './offer.model.js';
import {OfferServiceInterface} from './offer-service.interface.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(OfferModelToken) private readonly offerModel: Model<OfferDocument>,
    @inject(CommentModelToken) private readonly commentModel: Model<CommentDocument>,
    @inject(FavoriteModelToken) private readonly favoriteModel: Model<FavoriteDocument>,
  ) {}

  public async findById(id: string): Promise<HydratedDocument<OfferDocument> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async findMany(limit = 60): Promise<HydratedDocument<OfferDocument>[]> {
    return this.offerModel.find().sort({publishedAt: -1}).limit(limit).exec();
  }

  public async findPremium(city: CityName): Promise<HydratedDocument<OfferDocument>[]> {
    return this.offerModel.find({city, isPremium: true}).sort({publishedAt: -1}).limit(3).exec();
  }

  public async create(dto: CreateOfferDto, authorId: Types.ObjectId): Promise<HydratedDocument<OfferDocument>> {
    return this.offerModel.create({
      title: dto.title,
      description: dto.description,
      publishedAt: dto.publishedAt,
      city: dto.city,
      previewImage: dto.previewImage,
      images: dto.images,
      isPremium: dto.isPremium,
      isFavorite: false,
      rating: 0,
      ratingSum: 0,
      housingType: dto.housingType,
      bedrooms: dto.bedrooms,
      maxAdults: dto.maxAdults,
      price: dto.price,
      amenities: dto.amenities,
      author: authorId,
      commentCount: 0,
      location: dto.location,
    });
  }

  public async updateById(id: string, authorId: Types.ObjectId, dto: UpdateOfferDto): Promise<HydratedDocument<OfferDocument> | null> {
    const fields: (keyof CreateOfferDto)[] = [
      'title', 'description', 'publishedAt', 'city', 'previewImage', 'images',
      'isPremium', 'housingType', 'bedrooms', 'maxAdults', 'price', 'amenities', 'location',
    ];
    const changes = Object.fromEntries(fields.filter((field) => dto[field] !== undefined).map((field) => [field, dto[field]]));
    return this.offerModel.findOneAndUpdate({_id: id, author: authorId}, changes, {new: true}).exec();
  }

  public async deleteById(id: string, authorId: Types.ObjectId): Promise<HydratedDocument<OfferDocument> | null> {
    const offer = await this.offerModel.findOneAndDelete({_id: id, author: authorId}).exec();
    if (offer) {
      await Promise.all([
        this.commentModel.deleteMany({offer: offer._id}).exec(),
        this.favoriteModel.deleteMany({offer: offer._id}).exec(),
      ]);
    }
    return offer;
  }
}
