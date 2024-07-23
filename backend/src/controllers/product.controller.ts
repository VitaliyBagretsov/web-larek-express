import { NextFunction, Request, Response } from 'express';
import Product from '../models/product.model';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch((error) => next(error.message));

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.send({ data: product }))
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(error.message));
      }
      
      if(error.name === 'ValidationError'){
        return next(new BadRequestError(`Validation error: ${error.message}`));
      }

      return next(error.message);
    });
};
