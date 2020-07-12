const secret = require("./secret.js");

const environment = process.env.NODE_ENV || "development";

let jwtKey, databaseUrl, port;

if (environment === "development") {
  port = 4001;
  jwtKey = secret.jwtKey;
  databaseUrl = secret.databaseUrl;
} else {
  port = process.env.PORT;
  jwtKey = process.env.JWTKEY;
  databaseUrl = process.env.DATABASE_URL;
}
module.exports = {
  jwtKey,
  databaseUrl,
  port,
};
