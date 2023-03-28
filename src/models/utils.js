exports.responseRowsOrError = ({ rows }, status, messageIfNoRows) => {
  if (!rows.length)
    return Promise.reject({
      status: status,
      message: messageIfNoRows,
    });
  return rows;
};

exports.responseRowsOr404 = ({ rows }, messageIfNoRows) => {
  if (!rows.length)
    return Promise.reject({
      status: 404,
      message: messageIfNoRows || "page not found",
    });
  return rows;
};
