import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import Product from '../models/product.model';
import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';

interface IOrder {
  payment: 'card' | 'online';
  email: string; // "admin@ya.ru"
  phone: string; // "+7999999999";
  address: string; // "test";
  total: number; // 4200;
  items: string[];
}

export const orderSchema = Joi.object<IOrder>({
  payment: Joi.equal('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/)
    .required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().required(),
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchema,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = orderSchema.validate(req.body as IOrder);
    if (error) {
      return next(new BadRequestError(`Validation error: ${error.message}`));
    }

    const products = (
      await Product.find({
        _id: {
          $in: value.items.map(
            (item: string) => new mongoose.Types.ObjectId(item),
          ),
        },
      })
    ).filter((product) => !!product.price);

    // Проверяем что товары есть в базе и продаются(price > 0)
    if (products.length !== value.items.length) {
      return next(
        new BadRequestError(
          'Product data error: Not all products are available',
        ),
      );
    }

    // Проверяем соответствие суммы
    const productSum = products.reduce((sum, curr) => sum + curr.price, 0);
    if (value.total !== productSum) {
      return next(
        new BadRequestError(
          'Order data error: Order total is not equal products price DB sum',
        ),
      );
    }

    return res.status(200).send({
      id: faker.number.hex({ min: 1000000000, max: 1000000000 }),
      total: productSum,
    });
  } catch (error) {
    return next(new ServerError(`Server error: ${JSON.stringify(error)}`));
  }
};
