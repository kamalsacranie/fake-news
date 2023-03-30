import { responseRowsOr404 } from "../models/utils";

describe("responseRowsOr404())", () => {
  it("should return the rows array when given a mock query object with results", () => {
    const input = { rows: [1, 2, 3] };
    expect(responseRowsOr404(input)).toEqual([1, 2, 3]);
  });
  it("should return a rejected promise when rows have no entries", async () => {
    const input = { rows: [] };
    try {
      await responseRowsOr404(input);
    } catch (err: any) {
      expect(err.message).toBe("page not found");
      expect(err.status).toBe(404);
    }
  });
});
