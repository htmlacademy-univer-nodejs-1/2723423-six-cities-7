import {HydratedDocument} from 'mongoose';
import {User} from '../../types/user.js';
import {UserDocument} from './user.model.js';

export interface UserServiceInterface {
  findById(id: string): Promise<HydratedDocument<UserDocument> | null>;
  findByEmail(email: string): Promise<HydratedDocument<UserDocument> | null>;
  create(user: User): Promise<HydratedDocument<UserDocument>>;
}
