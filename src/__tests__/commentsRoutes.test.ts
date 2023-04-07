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

describe("DELETE /api/comments/:commentId", () => {
  describe("Happy path", () => {
    it("should respond with a 204", async () => {
      const { body } = await request(app).delete("/api/comments/1").expect(204);
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

describe("PATCH /api/comments/:commentId", () => {
  describe("happy path", () => {
    it("should return a 200", async () => {
      await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200);
    });
    it("should return an object", async () => {
      const {
        body: { comment },
      } = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200);
      expect(comment).toBeInstanceOf(Object);
    });
    it("the object should match the associated comment object in the database but with the updated values", async () => {
      const {
        body: { comment: updatedComment },
      } = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200);
      expect(updatedComment).toEqual({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 26,
        author: "butter_bridge",
        article_id: 9,
        created_at: "2020-04-06T12:17:00.000Z",
      });

      const {
        body: { comment: updatedComment2 },
      } = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -10 })
        .expect(200);
      expect(updatedComment2).toEqual({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: "2020-04-06T12:17:00.000Z",
      });
    });
  });
  describe("Sad path", () => {
    it("should receive 400 if any of the required keys are missing", async () => {
      await request(app).patch("/api/comments/1").send({}).expect(400);
    });
    it("should receive 404 if comment id not found", async () => {
      await request(app)
        .patch("/api/comments/9999")
        .send({ inc_votes: -10 })
        .expect(404);
    });
    it("should receive 400 if bad comment id provided", async () => {
      await request(app)
        .patch("/api/comments/fdjsioa")
        .send({ inc_votes: -10 })
        .expect(400);
    });
    it("should return 400 if invalid datatypes for inc_votes is passed", async () => {
      await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "jkfdj" })
        .expect(400);
    });
  });
});
