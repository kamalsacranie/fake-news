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

describe("GET /api/articles/:article_id", () => {
  describe("Happy path", () => {
    it("should return 200", async () => {
      await request(app).get("/api/articles/1").expect(200);
    });
    it("shouold return a object matching the article schema", async () => {
      const {
        body: { article },
      } = await request(app).get("/api/articles/1").expect(200);
      expect(article).toMatchObject({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        article_id: 1,
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });
  });
  describe("Sad path", () => {
    it("Should return 404 if the id specified does not exists in the database", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/articles/1000000").expect(404);
      expect(message).toBe("article not found");
    });
    it("Should return 400 if the ID is specified incorrectly", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/articles/string").expect(400);
      expect(message).toBe("the aticle id specified is not a valid");
    });
  });
});
