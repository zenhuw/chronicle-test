import { User } from '@prisma/client';
import { Request } from 'express';

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  _id: string;
}

export interface RequestModified extends Request {
  user: User;
}
