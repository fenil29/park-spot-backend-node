const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const Joi = require('@hapi/joi');
const uq = require("./user_queries.js");
const phq = require("./ph_queries.js");
const parkingq = require("./pl_queries");
const vpparking = require("./virtual_parking_queries");
const spotq = require("./spot_queries");
const store_parking_data = require("./store_parking_data");
const plhq = require("./plh_queries");
const auth = require("./auth.js");
const { port } = require("./config.js");


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// this function is for storing parking lot data in fms_parking_lot_history table for data analytics
// store_parking_data();

//allowing cors for all in development
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (request, response) => {
  response.json({ info: "find my parking spot api" });
});
// //fms_user
// app.get("/users", uq.getUsers);
// app.get("/users/id/:id", uq.getUserById);
// app.get("/users/fname/:fname", uq.getUserByfname);
// app.get("/users/lname/:lname", uq.getUserBylname);

app.post("/users/login", uq.login);
app.post("/users", uq.createUser);
// app.put("/users/:id", uq.updateUser);
// app.delete("/users/:id", uq.deleteUser);

// //fms_parking_history
// app.get("/history", phq.getHistory);
// get all the information about pastz record
app.get("/history/id/:user_id",auth.verifyToken,auth.verifyUserId, phq.getUserById);
// app.post("/history", phq.createhistory);
// app.put("/history/:id", phq.updateHistory);
// app.delete("/history/:id", phq.deleteHistory);

// //fms_parking_lot
//info about all the parking lot
app.get("/parking",auth.verifyToken, parkingq.getPD);
// app.get("/parking/id/:id", parkingq.getPDById);
// app.get("/parking/name/:name", parkingq.getPDByname);
// get info of all parking lot of provider
app.get("/parking/:owner_id",auth.verifyToken,auth.verifyOwnerId, parkingq.getPDByOwner);
// to create new parking lot
app.post("/parking/:owner_id",auth.verifyToken,auth.verifyOwnerId, parkingq.createPD);
// app.put("/parking/:id", parkingq.updatePD);
// app.delete("/parking/:id", parkingq.deletePD);

// //fms_parking_spot

// app.get("/spot", spotq.getSD);
// app.get("/spot/id/:id", spotq.getSDById);
// app.get("/spot/id/:id/status/:status", spotq.getSDBystatus);
app.post("/spot/get/:user_id",auth.verifyToken,auth.verifyUserId, spotq.getSpot);
app.post("/spot/left/:user_id",auth.verifyToken,auth.verifyUserId, spotq.leaveSpot);
// app.post("/spot", spotq.createSD);
// app.put("/spot/:id", spotq.updateSD);
// app.delete("/spot/:id", spotq.deleteSD);

// //fms_parking_lot_history

app.post("/lot-history/:pd_lot_id",auth.verifyToken, plhq.getPLHistory);
app.post("/lot-history-by-month/:pd_lot_id",auth.verifyToken, plhq.getPLHistoryByMonth);

//for virtual parking lot
app.get("/vp-parking", vpparking.getPD);
app.get("/vp-parking/id/:id", vpparking.getPDById);
app.get("/vp-parkings-pots/:id", vpparking.getPDSpots);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
