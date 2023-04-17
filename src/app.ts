import express, { ErrorRequestHandler, RequestHandler } from "express";
import apiRouter from "./routes/api";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use(function (req, res, next) {
  next({ status: 404, message: "page not found" });
} as RequestHandler);

app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({ message: err.message });
} as ErrorRequestHandler);

export default app;
