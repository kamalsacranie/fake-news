import runSeed from "../db/seeds/run-seed";
import db from "../db";
import request from "supertest";
import app from "../app";

beforeEach(async () => {
  await runSeed();
});
afterAll(() => {
  db.end();
});

// I think problems stem from the fact that these are all run asynchronously and
// we cannot know if there is an article in the database because it could've been
// deleted.
describe("DELETE /api/comments/:commentId", () => {
  describe("Happy path", () => {
    it("should not return any conetnt", async () => {
      const { body } = await request(app).delete("/api/comments/2").expect(204);
      expect(body).toEqual({});
    });
    it("should remove the comment from the comments table", async () => {
      await request(app).delete("/api/comments/3").expect(204);
      const { rows } = await db.query(
        `SELECT * FROM comments WHERE comment_id = 3`
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
