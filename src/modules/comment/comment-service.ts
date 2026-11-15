import {inject, injectable} from 'inversify';
import {HydratedDocument, Model, Types} from 'mongoose';
import {CommentModelToken, OfferModelToken} from '../../container.types.js';
import {OfferDocument} from '../offer/offer.model.js';
import {CommentDocument} from './comment.model.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(CommentModelToken) private readonly commentModel: Model<CommentDocument>,
    @inject(OfferModelToken) private readonly offerModel: Model<OfferDocument>,
  ) {}

  public async findLatest(offerId: Types.ObjectId): Promise<HydratedDocument<CommentDocument>[]> {
    return this.commentModel.find({offer: offerId}).sort({publishedAt: -1, _id: -1}).limit(50).exec();
  }

  public async create(offerId: Types.ObjectId, authorId: Types.ObjectId, dto: CreateCommentDto): Promise<HydratedDocument<CommentDocument> | null> {
    if (!await this.offerModel.exists({_id: offerId})) {
      return null;
    }

    const comment = await this.commentModel.create({
      text: dto.text,
      rating: dto.rating,
      publishedAt: new Date(),
      author: authorId,
      offer: offerId,
    });

    const newCount = {$add: [{$ifNull: ['$commentCount', 0]}, 1]};
    const newSum = {$add: [{$ifNull: ['$ratingSum', 0]}, dto.rating]};
    try {
      const updated = await this.offerModel.updateOne({_id: offerId}, [{$set: {
        commentCount: newCount,
        ratingSum: newSum,
        rating: {$round: [{$divide: [newSum, newCount]}, 1]},
      }}]).exec();
      if (updated.matchedCount === 0) {
        await this.commentModel.deleteOne({_id: comment._id}).exec();
        return null;
      }
    } catch (error) {
      await this.commentModel.deleteOne({_id: comment._id}).exec();
      throw error;
    }

    return comment;
  }
}
