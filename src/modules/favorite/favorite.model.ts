import {model, Schema, Types} from 'mongoose';

export type FavoriteDocument = {
  user: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const favoriteSchema = new Schema<FavoriteDocument>({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  offer: {type: Schema.Types.ObjectId, ref: 'Offer', required: true},
}, {timestamps: true, collection: 'favorites'});

favoriteSchema.index({user: 1, offer: 1}, {unique: true});

export const FavoriteModel = model<FavoriteDocument>('Favorite', favoriteSchema);
