const { Pool, Client } = require("pg");
//const Joi = require('@hapi/joi');

const { databaseUrl } = require("./config.js");

const connectionString = databaseUrl;
const pool = new Pool({
  connectionString: connectionString,
});

module.exports = {
  pool,
};
