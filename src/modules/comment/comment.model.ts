import {model, Schema, Types} from 'mongoose';

export type CommentDocument = {
  text: string;
  publishedAt: Date;
  rating: number;
  author: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const commentSchema = new Schema<CommentDocument>({
  text: {type: String, required: true},
  publishedAt: {type: Date, required: true, default: Date.now},
  rating: {type: Number, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  offer: {type: Schema.Types.ObjectId, ref: 'Offer', required: true},
}, {timestamps: true, collection: 'comments'});

commentSchema.index({offer: 1, publishedAt: -1});

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
