import devData from "../data/development-data";
import testData from "../data/test-data";
import seed from "./seed";
import db from "../";

function runSeed() {
  return seed(process.env.NODE_ENV === "test" ? testData : devData);
}

if (require.main === module) {
  runSeed().then(() => db.end());
}

export default runSeed;
