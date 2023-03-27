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

describe("GET to /api", () => {
  describe("Happy path", () => {
    it("Should return 200", async () => {
      await request(app).get("/api").expect(200);
    });
    it("Should return the message 'welcome to my fake news server'", async () => {
      await request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("welcome to my fake news server");
        });
    });
  });
  describe("Sad path", () => {
    it("Should return 404 if non matching path is given", async () => {
      await request(app).get("/wrongendpoint").expect(404);
      await request(app)
        .get("/wrongendpoint")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("page not found");
        });
    });
  });
});
