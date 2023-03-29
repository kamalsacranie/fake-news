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
        comment_count: "11",
      });
    });
    it("shouold return a object matching the article schema where comment_count is 0 if the artilce has no comments", async () => {
      const {
        body: { article },
      } = await request(app).get("/api/articles/2").expect(200);
      expect(article).toMatchObject({
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        article_id: 2,
        body: expect.any(String),
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: "0",
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
      expect(message).toBe("the articleId specified is not a valid");
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
        if (article.created_at) expect(article.created_at).toBeDateString();
      });
    });
    it("Articles should be sorted in decending order by their created_at", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles").expect(200);
      const unsortedArticles = [...articles];
      articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      expect(unsortedArticles).toEqual(articles);
    });
  });
  describe("Query parameters", () => {
    describe("Happy path", () => {
      it("should filter articles by topic when topic query is given", async () => {
        const {
          body: { articles },
        } = await request(app).get("/api/articles?topic=mitch").expect(200);
        expect(articles).toHaveLength(11);
        articles.forEach((article) => expect(article.topic).toBe("mitch"));
      });
      it("should sort artciles by the given query parameter", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200);
        const unsortedArticles = [...articles];
        expect(unsortedArticles).toEqual(
          articles.sort((a, b) => a.article_id + b.article_id)
        );
      });
      it("should sort by ascending or descending if given the query parameter", async () => {
        const {
          body: { articles },
        } = await request(app).get("/api/articles?order=desc").expect(200);
        const unsortedArticles = [...articles];
        expect(unsortedArticles).toEqual(
          articles.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );

        const {
          body: { articles: articles2 },
        } = await request(app).get("/api/articles?order=asc").expect(200);
        const unsortedArticles2 = [...articles2];
        expect(unsortedArticles2).toEqual(articles.reverse());
      });
      it("should do all the query params at once 🤪", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
          .expect(200);
        expect(
          articles.every((article, i, arr) => {
            return i === 0 || article.article_id > arr[i - 1].article_id;
          })
        ).toBe(true);
        articles.forEach((article) => expect(article.topic).toBe("mitch"));
      });
    });
    describe("Sad path", () => {
      it("should return an empty array when given a topic with no entries", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?topic=jfdksjlkfj")
          .expect(200);
        expect(articles).toHaveLength(0);
      });
      it("should do nothing different if passed an incorrect value for oder query", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?order=jfdksjlkfj")
          .expect(200);
        const unsortedArticles = [...articles];
        articles.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(unsortedArticles).toEqual(articles);
      });
      it("should do nothing different if passed an incorrect value for sort_by query", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?sort_by=jfdksjlkfj")
          .expect(200);
        const unsortedArticles = [...articles];
        articles.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(unsortedArticles).toEqual(articles);
      });
      it("should do nothing different if random queries are passed in", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?pardon=thisisbad")
          .expect(200);
        const unsortedArticles = [...articles];
        articles.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(unsortedArticles).toEqual(articles);
      });
    });
  });
});

describe("GET /api/articles/:articleId/comments", () => {
  describe("Happy path", () => {
    it("should return an array of objects", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments").expect(200);
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(11);
    });
    it("comments should match the comment object schema", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments").expect(200);
      expect(comments).not.toHaveLength(0);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          body: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String || undefined),
          votes: expect.any(Number),
        });
        if (comment.created_at) expect(comment.created_at).toBeDateString();
      });
    });
    it("comments should be returned with the most recent first", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments").expect(200);
      const unsortedComments = [...comments];
      comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      expect(unsortedComments).toEqual(comments);
    });
  });
  describe("Sad path", () => {
    it("Should return 404 if the id specified does not exists in the database", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/articles/1000000/comments").expect(404);
      expect(message).toBe("article not found");
    });
    it("Should return 400 if the ID is specified incorrectly", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/articles/string/comments").expect(400);
      expect(message).toBe("the articleId specified is not a valid");
    });
    it("should return an empty list if there are no comments associated with an article", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/2/comments").expect(200);
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(0);
    });
  });
});

describe("POST /api/articles/:articleId/comments", () => {
  describe("Happy path", () => {
    let comment;
    beforeEach(() => {
      comment = { username: "lurker", body: "new comment" };
    });
    it("should respond with a 201", async () => {
      await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201);
    });
    it("should respond with an object", async () => {
      const {
        body: { comment: newComment },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201);
      expect(newComment).toBeInstanceOf(Object);
    });
    it("should match the object values with the comment id", async () => {
      const {
        body: { comment: newComment },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201);
      expect(newComment).toMatchObject({
        comment_id: 19,
        author: comment.username,
        body: comment.body,
        votes: 0,
        article_id: 1,
        created_at: expect.any(String),
      });
    });
  });
  describe("Sad path", () => {
    it("Random username should not be allowed to POST", async () => {
      const comment = { username: "notauser", body: "new comment" };
      const {
        body: { message },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400);
      expect(message).toBe("unknown user");
    });
    it("Should return 400 if the ID is specified incorrectly", async () => {
      const {
        body: { message },
      } = await request(app).post("/api/articles/string/comments").expect(400);
      expect(message).toBe("the articleId specified is not a valid");
    });
    it("should return a 400 if incorrectly structured object is passed in", async () => {
      const comment = {
        body: "jfdslkjk",
      };
      await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400);
    });
    it("should return the message 'bad POST request' when a bad object is given", async () => {
      const comment = {
        body: "jfdslkjk",
      };
      const {
        body: { message },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400);
      expect(message).toBe("bad POST request");
    });
    it("should alert the user if they send a comment to an article that doesn't exist", async () => {
      const comment = { username: "lurker", body: "new comment" };
      const { body } = await request(app)
        .post("/api/articles/999/comments")
        .send(comment)
        .expect(404);
      expect(body.message).toBe("article not found");
    });
  });
});

describe("PATCH /api/articles/:articleId", () => {
  describe("happy path", () => {
    it("should return a 200", async () => {
      await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200);
    });
    it("should return an object", async () => {
      const {
        body: { article },
      } = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200);
      expect(article).toBeInstanceOf(Object);
    });
    it("the object should match the associated article object in the database but with the updated values", async () => {
      const {
        body: { article: updatedArticle },
      } = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200);
      expect(updatedArticle).toEqual({
        article_id: 1,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        title: "Living in the shadow of a great man",
        topic: "mitch",
        votes: 110,
      });

      const {
        body: { article: updatedArticle2 },
      } = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200);
      expect(updatedArticle2).toEqual({
        article_id: 1,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        title: "Living in the shadow of a great man",
        topic: "mitch",
        votes: 100,
      });
    });
  });
  describe("Sad path", () => {
    it("should receive 400 if any of the required keys are missing", async () => {
      await request(app).patch("/api/articles/1").send({}).expect(400);
    });
    it("should receive 404 if article id not found", async () => {
      await request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: -10 })
        .expect(404);
    });
    it("should receive 400 if bad article id provided", async () => {
      await request(app)
        .patch("/api/articles/fdjsioa")
        .send({ inc_votes: -10 })
        .expect(400);
    });
  });
});
