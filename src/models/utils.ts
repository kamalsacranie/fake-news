import format from "pg-format";
import db from "../db";

export const responseRowsOrError = function <T = unknown>(
  response: T,
  status: number,
  messageIfNoRows: string
) {
  if (!response)
    return Promise.reject({
      status: status,
      message: messageIfNoRows,
    });
  return response;
};

// remove general typeing
export const responseRowsOr404 = function <T = unknown>(
  response: T,
  messageIfNoRows?: string
) {
  if (!response) {
    return Promise.reject({
      status: 404,
      message: messageIfNoRows || "page not found",
    });
  }
};

export const updateNumericColumn = async function <T>(
  tableName: string,
  numericColumnName: string,
  changeAmount: number,
  tablePrimaryKeyColumnName: string,
  tablePrimayKeyValue: string
) {
  const formattedQuery = format(
    `
      UPDATE %I
      SET %2$I = %2$I + %s
      WHERE %s = %s
      RETURNING *;
    `,
    tableName,
    numericColumnName,
    changeAmount,
    tablePrimaryKeyColumnName,
    tablePrimayKeyValue
  );
  const {
    rows: [updatedItem],
  } = await db.query(formattedQuery);
  return updatedItem as T | undefined;
};
