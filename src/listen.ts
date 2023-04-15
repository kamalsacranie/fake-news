import app from "./app";
import * as dotenv from "dotenv";

const baseEnvPath = `${__dirname}/../.env`;
dotenv.config({ path: baseEnvPath });
const { PORT } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
