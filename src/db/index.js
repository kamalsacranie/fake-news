const { Pool } = require("pg");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "development";

const baseEnvPath = `${__dirname}/../../.env`;
dotenv.config({ path: baseEnvPath });
dotenv.config({
  path: `${baseEnvPath}.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}

module.exports = new Pool();
