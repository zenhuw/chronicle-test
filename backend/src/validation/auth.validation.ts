import Joi from 'joi';
import { ChangePasswordData, LoginData } from '../interfaces/auth.interface';

export function loginValidation(login: LoginData) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required()
  });

  return schema.validate(login);
}

export function changePasswordValidation(changePassword: ChangePasswordData) {
  const schema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required()
  });

  return schema.validate(changePassword);
}
