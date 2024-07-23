import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

const errorHandler = (req: Request, _res: Response, next: NextFunction) => next(new NotFoundError(`End-point ${req.url} not found`));

export default errorHandler;
