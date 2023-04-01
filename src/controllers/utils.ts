import { NextFunction } from "express";
import { InvalidPostObject, InvalidQueryParam } from "./errorStatus";

export const baseError = async (next: NextFunction, callback: Function) => {
  try {
    await callback();
  } catch (err: any) {
    if (err.code === "23503")
      return next(new InvalidPostObject(400, "unknown user"));
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
