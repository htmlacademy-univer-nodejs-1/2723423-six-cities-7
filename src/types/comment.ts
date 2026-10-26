import {User} from './user.js';

export type Comment = {
  text: string;
  publishedAt: Date;
  rating: number;
  author: User;
};
