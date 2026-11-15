import {Types} from 'mongoose';

export type CreateFavoriteDto = {
  userId: Types.ObjectId;
  offerId: Types.ObjectId;
};
