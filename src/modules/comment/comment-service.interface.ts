import {HydratedDocument, Types} from 'mongoose';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentDocument} from './comment.model.js';

export interface CommentServiceInterface {
  findLatest(offerId: Types.ObjectId): Promise<HydratedDocument<CommentDocument>[]>;
  create(offerId: Types.ObjectId, authorId: Types.ObjectId, dto: CreateCommentDto): Promise<HydratedDocument<CommentDocument> | null>;
}
