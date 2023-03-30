import { ErrorRequestHandler } from "express";

export const sqlError = (
  message: string,
  status = 404
): ErrorRequestHandler => {
  return (err, req, res, next) => {
    if (err.code) {
      res.status(status).send({
        code: err.code,
        message,
      });
    } else {
      next(err);
    }
  };
};
