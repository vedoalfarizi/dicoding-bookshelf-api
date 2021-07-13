require('dotenv').config();
const confidence = require('confidence');

const config = {
  env: process.env.NODE_ENV,
  localhost: process.env.LOCALHOST,
  prodhost: process.env.PRODHOST,
  port: process.env.PORT,
};

const store = new confidence.Store(config);

exports.get = (key) => store.get(key);
