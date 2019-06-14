import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "../../../domain/core/validator";

export const errorMiddleware: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message, errors: err.details });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: "error.not-found" });
  }

  next(err);
};
