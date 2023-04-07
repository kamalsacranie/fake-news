import { NextFunction } from "express";
import { BaseError, InvalidPostObject, InvalidQueryParam } from "./errorStatus";

export const baseError = async (
  next: NextFunction,
  callback: Function,
  failCriteria: (err: any) => boolean = () => false,
  nextObj?: BaseError
) => {
  try {
    await callback();
  } catch (err: any) {
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
  callback: Function,
  failCriteria: (err: any) => boolean = () => false,
  nextObj?: BaseError
) => {
  if (!parseInt(numericParametric))
    return next(new InvalidQueryParam(400, queryParamName));
  baseError(next, callback, failCriteria, nextObj);
};

export const checkNoObjectValuesAreUndefined = (
  object: Record<string, any>,
  next: NextFunction
) => {
  if (Object.values(object).includes(undefined))
    return next(new InvalidPostObject());
};
