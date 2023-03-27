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
  it("should return 200", async () => {
    await request(app).get("/api/articles/1").expect(200);
  });
  it("shouold return a object matching the article schema", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);
    expect(article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String || undefined),
      votes: expect.any(Number),
      article_img_url: expect.any(String || undefined),
    });
  });
});
