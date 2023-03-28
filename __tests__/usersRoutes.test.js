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

describe("GET /api/users", () => {
  describe("Happy path", () => {
    it("Should return an array of elements", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(4);
    });
    it("Objects in response should match the structure of a users object", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      expect(users).not.toHaveLength(0);
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
    });
  });
  describe("Sad path", () => {
    it("Should return the error message 'our database does not have a users table'", async () => {
      await db.query(`DROP TABLE IF EXISTS users CASCADE;`);
      const {
        body: { message },
      } = await request(app).get("/api/users").expect(404);
      expect(message).toBe("our database does not have a users table");
      await runSeed();
    });
    it("Should return the error message 'currently no users in the database'", async () => {
      await db.query(`TRUNCATE TABLE users CASCADE;`);
      const {
        body: { message },
      } = await request(app).get("/api/users").expect(404);
      expect(message).toBe("currently no users in the database");
      await runSeed();
    });
    it("should return 404 if a bad endpoint is given /api/usersss", async () => {
      await request(app).get("/api/usersss/jfkdsj").expect(404);
    });
  });
});
