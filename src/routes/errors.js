exports.sqlError = (message, status = 404) => {
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
