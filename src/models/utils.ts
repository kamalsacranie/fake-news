export const responseRowsOrError = function <T = unknown>(
  { rows }: { rows: T[] },
  status: number,
  messageIfNoRows: string
) {
  if (!rows.length)
    return Promise.reject({
      status: status,
      message: messageIfNoRows,
    });
  return rows;
};

export const responseRowsOr404 = function <T = unknown>(
  { rows }: { rows: T[] },
  messageIfNoRows?: string
) {
  if (!rows.length) {
    return Promise.reject({
      status: 404,
      message: messageIfNoRows || "page not found",
    });
  }
  return rows;
};
