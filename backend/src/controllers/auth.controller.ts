import { compare, hash } from 'bcrypt';
import config from 'config';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { pick } from 'ramda';
import { ChangePasswordData, RequestModified, TokenData } from '../interfaces/auth.interface';
import { changePasswordValidation, loginValidation } from '../validation/auth.validation';
import prisma from '../utils/prisma';
import { User } from '@prisma/client';
import { userValidatorsPost } from '../validation/user.validation';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }
  try {
    const findUser = await prisma.user.findFirst({ where: { email: req.body.email, deleted_at: null } });

    if (!findUser) {
      return res.status(400).send({ error: 'Email not found' });
    }

    const isPasswordMatching = await compare(req.body.password, findUser.password);

    if (!isPasswordMatching) {
      return res.status(400).send({ error: 'Password not matching' });
    }

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json({ message: 'login' });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something wrong with the server');
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  const { error } = userValidatorsPost(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }
  try {
    const user = await prisma.user.findFirst({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).send({ error: 'User already exist' });
    }

    const hashedPassword = await hash(req.body.password, 10);

    const createdUserData = await prisma.user.create({ data: { ...req.body, password: hashedPassword } });

    res.status(201).json({
      data: pick(['id', 'first_name', 'last_name', 'sex', 'date_of_birth', 'address', 'email'], createdUserData),
      message: 'created'
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wrong with the server');
  }
});

authRouter.post('/change-password', isAuthenticated, async (req: RequestModified, res: Response) => {
  const body = req.body as ChangePasswordData;

  const { error } = changePasswordValidation(body);

  if (error) {
    return res.status(400).send({ error: error });
  }
  try {
    const isPasswordMatching = await compare(body.old_password, req.user.password);

    if (!isPasswordMatching) {
      return res.status(400).send({ error: 'Old password not matching' });
    }

    const hashedPassword = await hash(body.new_password, 10);

    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashedPassword } });

    res.clearCookie('Authorization');
    res.status(200).json({ message: 'password changed' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wrong with the server');
  }
});

authRouter.get('/me', async (req: RequestModified, res: Response) => {
  if (!req.user) {
    return res.status(401).send('Not Authorized');
  }
  const userNoPassword = pick(['id', 'first_name', 'last_name', 'sex', 'date_of_birth', 'address', 'email'], req.user);

  res.status(200).json({ ...userNoPassword });
});

authRouter.post('/logout', async (req: Request, res: Response) => {
  res.clearCookie('Authorization');
  res.status(200).json({ message: 'logged out' });
});

function createToken(user: User): TokenData {
  const expiresIn = 60 * 60;

  return { expiresIn, token: sign({ _id: user.id }, config.get('secretKey'), { expiresIn }) };
}

function createCookie(tokenData: TokenData) {
  return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/`;
}
