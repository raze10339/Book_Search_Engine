import { Types } from 'mongoose';

declare module 'express' {
  interface Request {
    user_id?: Types.ObjectId;
  }
}
