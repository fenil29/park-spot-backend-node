const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const Joi = require('@hapi/joi');
const uq = require("./user_queries.js");
const phq = require("./ph_queries.js");
const pdq = require("./pl_queries");
const sdq = require("./spot_queries");
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
//fms_user
app.get("/users", uq.getUsers);
app.get("/users/id/:id", uq.getUserById);
app.get("/users/fname/:fname", uq.getUserByfname);
app.get("/users/lname/:lname", uq.getUserBylname);

app.post("/users/login", uq.login);
app.post("/users", uq.createUser);
app.put("/users/:id", uq.updateUser);
app.delete("/users/:id", uq.deleteUser);

//fms_parking_history
app.get("/history", phq.getHistory);
app.get("/history/id/:id", phq.getUserById);
app.post("/history", phq.createhistory);
app.put("/history/:id", phq.updateHistory);
app.delete("/history/:id", phq.deleteHistory);

//fms_parking_lot
app.get("/pd", pdq.getPD);
app.get("/pd/id/:id", pdq.getPDById);
app.get("/pd/name/:name", pdq.getPDByname);
app.get("/pd/city/:city", pdq.getPDBycity);
app.get("/pd/state/:state", pdq.getPDByState);
app.get("/pd/pin/:pin", pdq.getPDBypin);
app.post("/pd", pdq.createPD);
app.put("/pd/:id", pdq.updatePD);
app.delete("/pd/:id", pdq.deletePD);

//fms_parking_spot

app.get("/sd", sdq.getSD);
app.get("/sd/id/:id", sdq.getSDById);
app.get("/sd/id/:id/status/:status", sdq.getSDBystatus);
app.post("/sd/:id", sdq.getSpot);
app.post("/sd", sdq.createSD);
app.put("/sd/:id", sdq.updateSD);
app.delete("/sd/:id", sdq.deleteSD);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
