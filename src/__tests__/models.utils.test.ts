import { responseRowsOr404 } from "../models/utils";

describe("responseRowsOr404())", () => {
  it("should return undefined when given a mock query object with results", () => {
    const input = { rows: [1, 2, 3] };
    expect(responseRowsOr404(input)).toEqual(undefined);
  });
  it("should reject a promise given a falsy value", async () => { // this is how i can use the function stuff
    const input = { rows: [] };
    try {
      await responseRowsOr404(input.rows.length);
    } catch (err: any) {
      console.log(err);
      expect(err.message).toBe("page not found");
      expect(err.status).toBe(404);
    }
  });
});
