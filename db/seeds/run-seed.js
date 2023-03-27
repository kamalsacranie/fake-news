const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

export default function runSeed() {
  return seed(process.env.NODE_ENV ? testData : devData);
}

if (require.main === module) {
  runSeed().then(() => db.end());
}

