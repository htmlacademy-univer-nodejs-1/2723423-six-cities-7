import {model, Schema} from 'mongoose';
import {UserType} from '../../types/user.js';

export type UserDocument = {
  name: string;
  email: string;
  avatar?: string;
  passwordHash: string;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  avatar: String,
  passwordHash: {type: String, required: true},
  type: {type: String, required: true},
}, {timestamps: true, collection: 'users'});

export const UserModel = model<UserDocument>('User', userSchema);
