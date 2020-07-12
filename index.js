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
// app.get("/api/users", uq.getUsers);
// app.get("/api/users/id/:id", uq.getUserById);
// app.get("/api/users/fname/:fname", uq.getUserByfname);
// app.get("/api/users/lname/:lname", uq.getUserBylname);

app.post("/api/users/login", uq.login);
app.post("/api/users", uq.createUser);
// app.put("/api/users/:id", uq.updateUser);
// app.delete("/api/users/:id", uq.deleteUser);

// //fms_parking_history
// app.get("/api/history", phq.getHistory);
// get all the information about pastz record
app.get("/api/history/id/:user_id",auth.verifyToken,auth.verifyUserId, phq.getUserById);
// app.post("/api/history", phq.createhistory);
// app.put("/api/history/:id", phq.updateHistory);
// app.delete("/api/history/:id", phq.deleteHistory);

// //fms_parking_lot
//info about all the parking lot
app.get("/api/parking",auth.verifyToken, parkingq.getPD);
// app.get("/api/parking/id/:id", parkingq.getPDById);
// app.get("/api/parking/name/:name", parkingq.getPDByname);
// get info of all parking lot of provider
app.get("/api/parking/:owner_id",auth.verifyToken,auth.verifyOwnerId, parkingq.getPDByOwner);
// to create new parking lot
app.post("/api/parking/:owner_id",auth.verifyToken,auth.verifyOwnerId, parkingq.createPD);
// app.put("/api/parking/:id", parkingq.updatePD);
// app.delete("/api/parking/:id", parkingq.deletePD);

// //fms_parking_spot

// app.get("/api/spot", spotq.getSD);
// app.get("/api/spot/id/:id", spotq.getSDById);
// app.get("/api/spot/id/:id/status/:status", spotq.getSDBystatus);
app.post("/api/spot/get/:user_id",auth.verifyToken,auth.verifyUserId, spotq.getSpot);
app.post("/api/spot/left/:user_id",auth.verifyToken,auth.verifyUserId, spotq.leaveSpot);
// app.post("/api/spot", spotq.createSD);
// app.put("/api/spot/:id", spotq.updateSD);
// app.delete("/api/spot/:id", spotq.deleteSD);

// //fms_parking_lot_history

app.post("/api/lot-history/:pd_lot_id",auth.verifyToken, plhq.getPLHistory);
app.post("/api/lot-history-by-month/:pd_lot_id",auth.verifyToken, plhq.getPLHistoryByMonth);

//for virtual parking lot
app.get("/api/vp-parking", vpparking.getPD);
app.get("/api/vp-parking/id/:id", vpparking.getPDById);
app.get("/api/vp-parkings-pots/:id", vpparking.getPDSpots);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
