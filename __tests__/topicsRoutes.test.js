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
    // it("Should return 404 if no table is not in database", async () => {
    //   await db.query(`DROP TABLE IF EXISTS topics CASCADE;`);
    //   await request(app).get("/api/topics").expect(404);
    //   await runSeed();
    // });
    // it("Should return the error message 'our database does not have a topics table'", async () => {
    //   await db.query(`DROP TABLE IF EXISTS topics CASCADE;`);
    //   const {
    //     body: { message },
    //   } = await request(app).get("/api/topics").expect(404);
    //   expect(message).toBe("our database does not have a topics table");
    //   await runSeed();
    // });
    // it("Should return 404 if no topics are in the table", async () => {
    //   await db.query(`TRUNCATE TABLE topics CASCADE;`);
    //   await request(app).get("/api/topics").expect(404);
    //   await runSeed();
    // });
    // it("Should return the error message 'currently no topics in the database'", async () => {
    //   await db.query(`TRUNCATE TABLE topics CASCADE;`);
    //   const {
    //     body: { message },
    //   } = await request(app).get("/api/topics").expect(404);
    //   expect(message).toBe("currently no topics in the database");
    //   await runSeed();
    // });
  });
});
