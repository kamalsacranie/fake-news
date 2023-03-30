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
    it("Should return the message endpoints.json file from directory root", async () => {
      // this is impossible to test for if you go for the approach of reading
      // the endpoints file in here because if it doesnt exist, botht the test
      // and /api endpoint won't be able to read it in. I'm also not sure how
      // I can sadpath test this without deleting the file temporarily
      const { body } = await request(app).get("/api").expect(200);
      expect(body).toBeInstanceOf(Object);
      Object.keys(body).map((key) => {
        const re = /\b(POST|DELETE|PATCH|GET)\b.*/i;
        expect(re.test(key)).toBe(true);
      });
      expect(body).not.toHaveProperty("message");
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
