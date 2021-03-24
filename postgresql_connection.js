const { Pool, Client } = require("pg");
//const Joi = require('@hapi/joi');

const { databaseUrl } = require("./config.js");

const connectionString = databaseUrl;
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
// const client = new Client({
//   connectionString: connectionString,
// })

pool.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  console.log(res)
});

module.exports = {
  pool,
};
