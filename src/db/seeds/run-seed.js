const devData = require("../data/development-data");
const testData = require("../data/test-data");
const seed = require("./seed.js");
const db = require("../");

function runSeed() {
  return seed(process.env.NODE_ENV ? testData : devData);
}

if (require.main === module) {
  runSeed().then(() => db.end());
}

module.exports = runSeed;
