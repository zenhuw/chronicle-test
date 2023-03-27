import { User } from '@prisma/client';
import Joi from 'joi';
import { UserPutBody, UsersGetQuery } from '../interfaces/user.interface';

export function userValidatorsPost(user: User) {
  const schema = Joi.object({
    first_name: Joi.string().min(1).max(255).required(),
    last_name: Joi.string().min(1).max(255).allow(null, ''),
    sex: Joi.string()
      .min(1)
      .max(1)
      .regex(/(?:m|f)$/)
      .required(),
    date_of_birth: Joi.string().isoDate().required(),
    address: Joi.string().min(5).max(255).allow(null, ''),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

export function userValidatorsGetList(data: UsersGetQuery) {
  const schema = Joi.object({
    email: Joi.string().allow(null, ''),
    current_page: Joi.number().required(),
    take: Joi.number().required(),
    cache: Joi.boolean().allow(null, '')
  });

  return schema.validate(data);
}

export function userValidatorsPut(user: UserPutBody) {
  const schema = Joi.object({
    first_name: Joi.string().min(1).max(255),
    last_name: Joi.string().min(1).max(255).allow(null, ''),
    sex: Joi.string()
      .min(1)
      .max(1)
      .regex(/(?:m|f)$/),
    date_of_birth: Joi.string().isoDate(),
    address: Joi.string().min(5).max(255).allow(null, '')
  });

  return schema.validate(user);
}
