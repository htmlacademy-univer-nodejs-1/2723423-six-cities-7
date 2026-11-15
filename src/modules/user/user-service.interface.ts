import {HydratedDocument} from 'mongoose';
import {CreateUserDto} from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {UserDocument} from './user.model.js';

export interface UserServiceInterface {
  findById(id: string): Promise<HydratedDocument<UserDocument> | null>;
  findByEmail(email: string): Promise<HydratedDocument<UserDocument> | null>;
  create(user: CreateUserDto): Promise<HydratedDocument<UserDocument>>;
  verifyPassword(user: HydratedDocument<UserDocument>, password: string): Promise<boolean>;
  authenticate(dto: LoginUserDto): Promise<HydratedDocument<UserDocument> | null>;
}
