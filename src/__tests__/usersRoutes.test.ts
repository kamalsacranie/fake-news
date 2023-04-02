import runSeed from "../db/seeds/run-seed";
import db from "../db";
import request from "supertest";
import app from "../app";
import { User } from "../models/users";

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
      users.forEach((user: User) => {
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

describe("POST /api/users", () => {
  describe("happy path", () => {
    it("should return a 201", async () => {
      const user = {
        username: "bigDickJohnny",
        name: "Johnny Lloyd",
        avatar_url:
          "https://pbs.twimg.com/media/FNDUA-hWQAABjP-?format=jpg&name=large",
      };
      await request(app).post("/api/users").send(user).expect(201);
    });
    it("should return the new user added", async () => {
      const user = {
        username: "bigDickJohnny",
        name: "Johnny Lloyd",
        avatar_url:
          "https://pbs.twimg.com/media/FNDUA-hWQAABjP-?format=jpg&name=large",
      };
      const {
        body: { user: newUser },
      } = await request(app).post("/api/users").send(user).expect(201);
      expect(newUser).toEqual({
        username: "bigDickJohnny",
        name: "Johnny Lloyd",
        avatar_url:
          "https://pbs.twimg.com/media/FNDUA-hWQAABjP-?format=jpg&name=large",
      });
    });
    it("should allow post request with only the mandatory field of the object", async () => {
      const user = {
        username: "bigDickJohnny",
        name: "Johnny Lloyd",
      };
      const {
        body: { user: newUser },
      } = await request(app).post("/api/users").send(user).expect(201);
      expect(newUser).toEqual({
        username: "bigDickJohnny",
        name: "Johnny Lloyd",
        avatar_url: null,
      });
    });
  });
  describe("Sad path", () => {
    it("should return 400 when given an object without all mandatory fields", async () => {
      const user = {
        username: "bigDickJohnny",
      };
      await request(app).post("/api/users").send(user).expect(400);
    });
    it("should return 400 and the message 'user already exists' when given a post request with a username already present", async () => {
      const user = {
        username: "bigDickJohnny",
        name: "Johnny Lloyd",
        avatar_url:
          "https://pbs.twimg.com/media/FNDUA-hWQAABjP-?format=jpg&name=large",
      };
      await request(app).post("/api/users").send(user);
      await request(app).post("/api/users").send(user).expect(400);
    });
  });
});

describe("GET /api/users/:username", () => {
  describe("Happy path", () => {
    it("should return 200", async () => {
      await request(app).get("/api/users/lurker").expect(200);
    });
    it("should return a user object", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/lurker").expect(200);
      expect(user).toEqual({
        username: "lurker",
        name: "do_nothing",
        avatar_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      });
    });
  });
  describe("Sad path", () => {
    it("invalid username should give 404", async () => {
      await request(app).get("/api/users/lurker").expect(200);
    });
    it("should return the error message 'user not found'", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/users/jfdlsjkflsjlkfdjs").expect(404);
      expect(message).toEqual("user not found");
    });
  });
});
