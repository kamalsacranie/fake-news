import runSeed from "../db/seeds/run-seed";
import db from "../db";
import request from "supertest";
import app from "../app";
import { Topic } from "../models/topics";

beforeEach(async () => {
  await runSeed();
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
      topics.forEach((topic: Topic) => {
        expect(topic).toBeInstanceOf(Object);
      });
    });
    it("Objects in response should match the structure of a topic object", async () => {
      const {
        body: { topics },
      } = await request(app).get("/api/topics").expect(200);
      topics.forEach((topic: Topic) => {
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

describe("POST /api/toipcs", () => {
  describe("Happy path", () => {
    let testTopic: {
      slug: string;
      description: string;
    };
    beforeEach(() => {
      testTopic = {
        slug: "bouldering",
        description:
          "The best sport in the world, even if I'm currently injured",
      };
    });
    it("should return 201 upon sucess", async () => {
      await request(app).post("/api/topics").send(testTopic).expect(201);
    });
    it("should return an object", async () => {
      const {
        body: { topic },
      } = await request(app).post("/api/topics").send(testTopic).expect(201);
      expect(topic).toBeInstanceOf(Object);
    });
    it("should return the new created topic", async () => {
      const {
        body: { topic },
      } = await request(app).post("/api/topics").send(testTopic).expect(201);
      expect(topic).toMatchObject({
        slug: "bouldering",
        description:
          "The best sport in the world, even if I'm currently injured",
      });
    });
    it("should slugify the given slug string even if not a slug", async () => {
      const testTopic = {
        slug: "Outdoor Bouldering (1990)",
        description:
          "The best sport in the world, even if I'm currently injured",
      };
      const {
        body: { topic },
      } = await request(app).post("/api/topics").send(testTopic);
      expect(topic.slug).toBe("outdoor-bouldering-1990");
    });
  });
  describe("Sad path", () => {
    it("should return 400 if any of required key values are undefined and the correct message", async () => {
      const testTopic = {
        slug: "bouldering",
      };
      const {
        body: { message },
      } = await request(app).post("/api/topics").send(testTopic).expect(400);
      expect(message).toBe("bad POST request");
    });
    it("should return 409 if topic already exists", async () => {
      const testTopic = {
        slug: "bouldering",
        description:
          "The best sport in the world, even if I'm currently injured",
      };
      await request(app).post("/api/topics").send(testTopic).expect(201);
      const {
        body: { message },
      } = await request(app).post("/api/topics").send(testTopic).expect(409);
      expect(message).toBe(`topic "bouldering" already exists`);
    });
  });
});
