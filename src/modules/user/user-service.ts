import {randomBytes, scrypt, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {inject, injectable} from 'inversify';
import {HydratedDocument, Model} from 'mongoose';
import {ConfigService} from '../../config/config-service.js';
import {UserModelToken} from '../../container.types.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {UserDocument} from './user.model.js';
import {UserServiceInterface} from './user-service.interface.js';

const deriveKey = promisify(scrypt);

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(UserModelToken) private readonly userModel: Model<UserDocument>,
    @inject(ConfigService) private readonly config: ConfigService,
  ) {}

  public async findById(id: string): Promise<HydratedDocument<UserDocument> | null> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<HydratedDocument<UserDocument> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async create(user: CreateUserDto): Promise<HydratedDocument<UserDocument>> {
    const salt = randomBytes(16).toString('hex');
    const hash = await deriveKey(user.password, `${this.config.getSalt()}:${salt}`, 64) as Buffer;
    return this.userModel.create({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      type: user.type,
      passwordHash: `${salt}:${hash.toString('hex')}`,
    });
  }

  public async verifyPassword(user: HydratedDocument<UserDocument>, password: string): Promise<boolean> {
    const [salt, savedHash] = user.passwordHash.split(':');
    if (!salt || !savedHash) {
      return false;
    }
    const actualHash = await deriveKey(password, `${this.config.getSalt()}:${salt}`, 64) as Buffer;
    const expectedHash = Buffer.from(savedHash, 'hex');
    return expectedHash.length === actualHash.length && timingSafeEqual(expectedHash, actualHash);
  }

  public async authenticate(dto: LoginUserDto): Promise<HydratedDocument<UserDocument> | null> {
    const user = await this.findByEmail(dto.email);
    return user && await this.verifyPassword(user, dto.password) ? user : null;
  }
}
