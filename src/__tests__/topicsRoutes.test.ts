import runSeed from "../db/seeds/run-seed";
import db from "../db";
import request from "supertest";
import app from "../app";
import { Topic } from "../models/topics";

beforeEach(() => {
  return runSeed();
});
afterAll(() => {
  db.end();
});

describe("GET to /api/topics", () => {
  describe("Happy path", () => {
    it("Should return a 200", async () => {
      await request(app).get("/api/topics").expect(200);
    });
    it("Should return an array of objects", async () => {
      const {
        body: { topics },
      } = await request(app).get("/api/topics").expect(200);
      expect(topics).toBeInstanceOf(Array);
      expect(topics.length).not.toBe(0);
      topics.forEach((topic: Topic) => {
        expect(topic).toBeInstanceOf(Object);
      });
    });
    it("Objects in response should match the structure of a topic object", async () => {
      const {
        body: { topics },
      } = await request(app).get("/api/topics").expect(200);
      topics.forEach((topic: Topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
  describe("Sad path", () => {
    it("should return 404 if a bad endpoint is given /api/usersss", async () => {
      await request(app).get("/api/topics/jfkdsj").expect(404);
      await request(app).get("/api/jdklsjfls").expect(404);
    });
  });
});
