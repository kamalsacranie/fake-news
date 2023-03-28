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

describe("GET /api/articles", () => {
  describe("Happy path", () => {
    it("should return a 200", async () => {
      await request(app).get("/api/articles").expect(200);
    });
    it("should return an array", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles").expect(200);
      expect(articles).toBeInstanceOf(Array);
    });
    it("should return a list of objects that match the article schema", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles").expect(200);
      expect(articles).not.toHaveLength(0);
      articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String || undefined),
          votes: expect.any(Number),
          article_img_url: expect.any(String || undefined),
          comment_count: expect.any(String),
        });
        if (article.created_at) expect(new Date(article.created_at)).toBeDate();
      });
    });
    it.only("Articles should be sorted in decending order by their created_at", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles").expect(200);
      const unsortedArticles = [...articles];
      articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      expect(unsortedArticles).toEqual(articles);
    });
  });
  describe("Sad path", () => {
    it("Should return the error message 'our database does not have a articles table'", async () => {
      await db.query(`DROP TABLE IF EXISTS articles CASCADE;`);
      const {
        body: { message },
      } = await request(app).get("/api/articles").expect(404);
      expect(message).toBe("our database does not have a articles table");
      await runSeed();
    });
    it("Should return the error message 'currently no topics in the database'", async () => {
      await db.query(`TRUNCATE TABLE articles CASCADE;`);
      const {
        body: { message },
      } = await request(app).get("/api/articles").expect(404);
      expect(message).toBe("the articles table currently contains no articles");
      await runSeed();
    });
  });
});
