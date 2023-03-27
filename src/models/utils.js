exports.responseRowsOr404 = ({ rows }, messageIfNoRows) => {
  if (!rows.length)
    return Promise.reject({
      status: 404,
      message: messageIfNoRows,
    });
  return rows;
};
