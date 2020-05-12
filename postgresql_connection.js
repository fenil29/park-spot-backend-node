const { Pool, Client } = require("pg");
//const Joi = require('@hapi/joi');
const connectionString = "postgresql://fms_admin:admin@localhost:5432/fms";
const pool = new Pool({
  connectionString: connectionString,
});

// const client = new Client({
//   connectionString: connectionString,
// })
module.exports = {
  pool,
  // client,
};
