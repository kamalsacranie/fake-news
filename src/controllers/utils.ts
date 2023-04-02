import { NextFunction } from "express";
import { InvalidPostObject, InvalidQueryParam } from "./errorStatus";

export const baseError = async (
  next: NextFunction,
  callback: Function,
  failCriteria = (err: any) => false,
  nextObj?: { [key: string]: any }
) => {
  try {
    await callback();
  } catch (err: any) {
    // allows us to pass fail criteria and nextObj through as args
    const failed = failCriteria(err);
    if (failed) {
      return next(nextObj || err);
    }
    next(err);
  }
};

export const numericParametricHandler = async (
  numericParametric: string,
  queryParamName: string,
  next: NextFunction,
  callback: Function
) => {
  if (!parseInt(numericParametric))
    return next(new InvalidQueryParam(400, queryParamName));

  baseError(next, callback);
};

export const objectValidator = (
  object: Record<string, any>,
  next: NextFunction
) => {
  if (Object.values(object).includes(undefined))
    return next(new InvalidPostObject());
};
