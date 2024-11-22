import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
const { verify } = jwt;

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async ({ req, res }: { req: AuthenticatedRequest; res: Response }) => {
  const book_app_token = req.cookies?.book_app_token;

  if (book_app_token) {
    try {

      if (!process.env.JWT_SECRET) {
        console.log('MUST ADD JWT_SECRET TO .env!');

        return {
          req: req,
          res: res
        }
      }

      const userData = verify(book_app_token, process.env.JWT_SECRET);

      if (!userData || typeof userData === 'string') {
        return {
          req: req,
          res: res
        }
      }

      const user = await User.findById(userData.user_id);

      req.user = user;

    } catch (error) {
      console.log('JWT VERIFICATION ERROR', error);
    }
  }

  return {
    req: req,
    res: res
  };
}