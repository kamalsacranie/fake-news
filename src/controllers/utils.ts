import { NextFunction } from "express";
import {
  InvalidPostObject,
  InvalidQueryParam,
  InvalidURL,
} from "./errorStatus";

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

export const checkNoObjectValuesAreUndefined = (
  object: Record<string, any>,
  next: NextFunction // not needed
) => {
  if (Object.values(object).includes(undefined)) {
    throw new InvalidPostObject(400);
  }
};

export const validateURL = (url: string | undefined) => {
  if (!url) return;
  try {
    new URL(url);
    return url;
  } catch (err: any) {
    if (err.code === "ERR_INVALID_URL") throw new InvalidURL(url);
  }
};
