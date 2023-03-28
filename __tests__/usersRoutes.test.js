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
    it("should return 404 if a bad endpoint is given /api/usersss", async () => {
      await request(app).get("/api/usersss/jfkdsj").expect(404);
    });
  });
});
