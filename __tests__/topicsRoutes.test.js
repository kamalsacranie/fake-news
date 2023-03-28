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
      topics.forEach((topic) => {
        expect(topic).toBeInstanceOf(Object);
      });
    });
    it("Objects in response should match the structure of a topic object", async () => {
      const {
        body: { topics },
      } = await request(app).get("/api/topics").expect(200);
      topics.forEach((topic) => {
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
