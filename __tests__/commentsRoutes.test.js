const runSeed = require("../src/db/seeds/run-seed");
const db = require("../src/db");
const request = require("supertest");
const app = require("../src/app");

beforeEach(() => {
  return runSeed();
});
afterAll(() => {
  db.end();
});

describe("DELETE /api/comments/:commentId", () => {
  describe("Happy path", () => {
    it("should return a 204", async () => {
      await request(app).delete("/api/comments/1").expect(204);
    });
    it("should not return any conetnt", async () => {
      const { body } = await request(app).delete("/api/comments/1").expect(204);
      expect(body).toEqual({});
    });
    it("should remove the comment from the comments table", async () => {
      await request(app).delete("/api/comments/1").expect(204);
      const { rows } = await db.query(
        `SELECT * FROM comments WHERE comment_id = 1`
      );
      expect(rows).toHaveLength(0);
    });
  });
  describe("Sad path", () => {
    it("should produce 404 when a non-existant comment ID is given", async () => {
      await request(app).delete("/api/comments/9999").expect(404);
    });
    it("should produce 400 when an invalid comment ID is given", async () => {
      await request(app).delete("/api/comments/banana").expect(400);
    });
  });
});
