import { Request, Response, Router } from 'express';
import prisma from '../utils/prisma';
import { UserPutBody, UsersGetQuery } from '../interfaces/user.interface';
import { pick } from 'ramda';
import { RequestModified } from '../interfaces/auth.interface';
import { userValidatorsGetList, userValidatorsPut } from '../validation/user.validation';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware';
import { getCache } from '../utils/cache';

export const userRouter = Router();

userRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  const query = req.query as unknown as UsersGetQuery;

  const { error } = userValidatorsGetList(query);

  if (error) {
    return res.status(400).send({ error: error });
  }
  try {
    const cache = await getCache();

    const cacheResult = await cache.get(JSON.stringify(query));

    if (cacheResult && query.cache === true) {
      return res.status(200).json(JSON.parse(cacheResult));
    }

    const count = await prisma.user.count({
      where: {
        email: { contains: query.email },
        deleted_at: null
      }
    });

    const users = await prisma.user.findMany({
      where: {
        email: { contains: query.email },
        deleted_at: null
      },
      skip: Math.floor(query.current_page * query.take - query.take),
      take: Number(query.take)
    });

    const usersNoPassword = users.map(res =>
      pick(['id', 'first_name', 'last_name', 'sex', 'date_of_birth', 'address', 'email'], res)
    );

    await cache.setEx(JSON.stringify(query), 180, JSON.stringify({ data: usersNoPassword, total: count }));

    res.status(200).json({ data: usersNoPassword, total: count });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wrong with the server');
  }
});

userRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;

    const user = await prisma.user.findFirst({ where: { id: idParam, deleted_at: null } });

    if (!user) {
      return res.status(400).send({ error: 'Id not found' });
    }

    const userNoPassword = pick(['id', 'first_name', 'last_name', 'sex', 'date_of_birth', 'address', 'email'], user);

    res.status(200).json({ data: userNoPassword });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wrong with the server');
  }
});

userRouter.put('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const body = req.body as UserPutBody;

    const { error } = userValidatorsPut(body);

    if (error) {
      return res.status(400).send({ error: error });
    }

    const userFind = await prisma.user.findFirst({ where: { id: idParam, deleted_at: null } });

    if (!userFind) {
      return res.status(400).send({ error: 'Id not found' });
    }

    const user = await prisma.user.update({ where: { id: idParam }, data: body });

    const userNoPassword = pick(['id', 'first_name', 'last_name', 'sex', 'date_of_birth', 'address', 'email'], user);

    res.status(200).json({ data: userNoPassword });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wrong with the server');
  }
});

userRouter.delete('/:id', isAuthenticated, async (req: RequestModified, res: Response) => {
  try {
    const idParam = req.params.id;

    const userFind = await prisma.user.findFirst({ where: { id: idParam } });

    if (!userFind) {
      return res.status(400).send({ error: 'Id not found' });
    }

    const user = await prisma.user.update({
      where: { id: idParam },
      data: { deleted_by_id: req.user.id, deleted_at: new Date() }
    });

    const userNoPassword = pick(['id', 'first_name', 'last_name', 'sex', 'date_of_birth', 'address', 'email'], user);

    res.status(200).json({ data: userNoPassword });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wrong with the server');
  }
});
