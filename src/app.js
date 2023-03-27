const express = require("express");
const apiRouter = require("./routes/api");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.use((req, res, next) => {
  next({ status: 404, message: "page not found" });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;
