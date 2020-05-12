const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const Joi = require('@hapi/joi');
const uq = require("./user_queries.js");
const phq = require("./ph_queries.js");
const parkingq = require("./pl_queries");
const spotq = require("./spot_queries");
const store_parking_data = require("./store_parking_data");
const plhq = require("./plh_queries");
const port = 4000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// this function is for storing parking lot data in fms_parking_lot_history table for data analytics
// store_parking_data();

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
app.get("/parking", parkingq.getPD);
app.get("/parking/id/:id", parkingq.getPDById);
app.get("/parking/name/:name", parkingq.getPDByname);
app.get("/parking/:id", parkingq.getPDByOwner);
app.post("/parking", parkingq.createPD);
app.put("/parking/:id", parkingq.updatePD);
app.delete("/parking/:id", parkingq.deletePD);

//fms_parking_spot

app.get("/spot", spotq.getSD);
app.get("/spot/id/:id", spotq.getSDById);
app.get("/spot/id/:id/status/:status", spotq.getSDBystatus);
app.post("/spot/get/:id", spotq.getSpot);
app.post("/spot/left/:id", spotq.leaveSpot);
app.post("/spot", spotq.createSD);
app.put("/spot/:id", spotq.updateSD);
app.delete("/spot/:id", spotq.deleteSD);

//fms_parking_lot_history

app.post("/lothistory", plhq.getPLHistory);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
