import { Pool } from "pg";
import * as dotenv from "dotenv";

const temp = process.env.NODE_ENV || "development";
console.log(temp);
const ENV = process.env.NODE_ENV || "development";

const baseEnvPath = `${__dirname}/../../.env`;
dotenv.config({ path: baseEnvPath });
dotenv.config({
  path: `${baseEnvPath}.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

export default ENV === "production"
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool();
