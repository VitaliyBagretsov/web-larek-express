import NotFoundError from "../errors/not-found-error";
import { Request, Response, NextFunction, RequestHandler } from "express";

const notFound: RequestHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next(new NotFoundError());
};

export default notFound;
