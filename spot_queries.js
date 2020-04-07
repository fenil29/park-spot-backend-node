const pool = require("./postgresql_connection.js").pool;
const validate = require("./validate.js");

const getSD = (request, response) => {
  pool.query(
    "SELECT * FROM fms_parking_spot ORDER BY lot_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getSDById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM fms_parking_spot WHERE lot_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getSDBystatus = (request, response) => {
  const status = request.params.status;
  const id = request.params.id;
  pool.query(
    "SELECT * FROM fms_parking_spot WHERE sd_status = $1 AND lot_id=$2",
    [status, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
//"UPDATE fms_parking_spot SET sd_status= 1,lot_id=$1 WHERE spot_no = min(spot_no)"

const getSpot = (request, response) => {
  const id = request.params.id;
  const user = request.body.user;
  validate.create_spot_schema.validate({ jno: id, jno: user });

  const temp = validate.create_spot_schema.validate({ jno: id, jno: user });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(400)
      .send("User Id or Parking Id is invalid. Please try again.");
  } else {
    (async () => {
      const client = await pool.connect();
      // note: we don't try/catch this because if connecting throws an exception
      // we don't need to dispose of the client (it will be undefined)
      try {
        await client.query("BEGIN");
        const verify =
          "SELECT user_id from fms_parking_history where user_id=$2 AND parking_lot=$1 AND out_time IS NULL";
        const verifyres = await client.query(verify, [id, user]);
        if (verifyres.rows[0] != null) {
          response.status(400).json({
            ...{ error_message: "User already present inside..." },
          });
        } else {
          const lot = "SELECT * from fms_parking_lot WHERE pd_lot_id=$1";
          const ParkingLotRes = await client.query(lot, [id]);
          const ParkingLotDetails = ParkingLotRes.rows[0];
          // console.log(ParkingLotDetails)
          const full =
            "select occupied_spot,total_spot from fms_parking_lot where pd_lot_id=$1";
          const Value = [id];
          const oc = await client.query(full, Value);
          // console.log("oc:" + JSON.stringify(oc));
          // console.log("oc:" + (oc.rows[0].occupied_spot));
          if (oc.rows[0].occupied_spot == oc.rows[0].total_spot) {
            response.status(400).json({
              ...ParkingLotDetails,
              ...{ error_message: "Sorry Parking is full..." },
            });
          } else {
            const queryText =
              "SELECT min(spot_no) as spot_no from fms_parking_spot WHERE sd_status = 0 AND lot_id=$1 ";
            const res = await client.query(queryText, [id]);
            const occupied =
              "UPDATE fms_parking_lot SET occupied_spot = occupied_spot + 1 WHERE pd_lot_id=$1";
            const Value = [id];
            await client.query(occupied, Value);
            const updateStatus =
              "UPDATE fms_parking_spot SET sd_status = 1 WHERE lot_id=$1 AND spot_no =$2";
            const Values = [id, Number(res.rows[0]["spot_no"])];
            await client.query(updateStatus, Values);
            const values2 = [user, id, Number(res.rows[0]["spot_no"])];
            const updateInTime =
              "insert into fms_parking_history values ($1,$2,$3,CURRENT_TIMESTAMP,NULL)";
            await client.query(updateInTime, values2);
            await client.query("COMMIT");
            response.status(200).json({ ...res.rows[0], ...ParkingLotDetails });
          }
        }
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    })().catch((e) => console.error(e.stack));
  }
};

//let spot_no;
// pool.query(
//   "SELECT min(spot_no) as spot_no from fms_parking_spot WHERE sd_status = 0 AND lot_id=$1 ",
//   [id],
//   (error, results) => {
//     if (!results.rows[0]["spot_no"]) {
//       response.send("Parking is full. ");
//     } else {
//       spot_no = Number(results.rows[0]["spot_no"]);
//       //response.status(200).json(results.rows[0]);
//       pool.query(
//         "UPDATE fms_parking_spot SET sd_status = 1 WHERE lot_id=$1 AND spot_no =$2 ",
//         [id, spot_no],
//         (error, results) => {
//           if (error) {
//             //throw error;
//             console.log(spot_no);
//             console.log(error);
//           }
//           //response.send("Status Updated");
//         }
//       );
//     }
//   }
// );
const leaveSpot = (request, response) => {
  const id = request.params.id;
  const user = request.body.user;
  validate.create_spot_schema.validate({ jno: id, jno: user });

  const temp = validate.create_spot_schema.validate({ jno: id, jno: user });

  //console.log(temp.error)
  if (temp.error) {
    response
      .status(400)
      .send("User Id or Parking Id is invalid. Please try again.");
  } else {
    (async () => {
      const client = await pool.connect();
      // note: we don't try/catch this because if connecting throws an exception
      // we don't need to dispose of the client (it will be undefined)
      try {
        await client.query("BEGIN");
        const lot = "SELECT * from fms_parking_lot WHERE pd_lot_id=$1";
        const ParkingLotRes = await client.query(lot, [id]);
        const ParkingLotDetails = ParkingLotRes.rows[0];
        response.status(400).json({
          ...ParkingLotDetails,
          ...{ message: "Thanks for Visiting. Please drive Safe..." },
        });
        const queryText =
          "SELECT parking_spot as spot_no from fms_parking_history WHERE user_id=$2 AND parking_lot=$1 AND out_time IS NULL";
        const res = await client.query(queryText, [id, user]);

        const updateStatus =
          "UPDATE fms_parking_spot SET sd_status = 0 WHERE lot_id=$1 AND spot_no =$2";
        const Values = [id, Number(res.rows[0]["spot_no"])];
        await client.query(updateStatus, Values);

        const occupied =
          "UPDATE fms_parking_lot SET occupied_spot = occupied_spot - 1 WHERE pd_lot_id=$1";
        const Value = [id];
        await client.query(occupied, Value);

        const values2 = [user, id];
        const updateOutTime =
          "update fms_parking_history set out_time = CURRENT_TIMESTAMP WHERE user_id=$1 AND parking_lot=$2";
        await client.query(updateOutTime, values2);
        const totalTime =
          "select out_time - in_time as Total_time from fms_parking_history WHERE user_id=$1 AND parking_lot=$2";
        const values3 = [user, id];
        const res1 = await client.query(totalTime, values3);

        await client.query("COMMIT");
        var hours = response.status(200).json(res1.rows[0].total_time.hours);
        var mins = response.status(200).json(res1.rows[0].total_time.minutes);
        //console.log(hours);
        //console.log("minutes:" + mins);
        //response.status(200).json(res.rows[0]);
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    })().catch((e) => console.error(e.stack));
  }
};

const createSD = (request, response) => {
  console.log(request.body);
  const { no, lot } = request.body;
  validate.create_spot_schema.validate({ jno: no, jno: lot });

  const temp = validate.create_spot_schema.validate({ jno: no, jno: lot });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(201)
      .send("Spot was not added. Invalid entry. Please try again.");
  } else {
    for (let index = 1; index <= no; index++) {
      var text =
        "INSERT INTO fms_parking_spot (spot_no,sd_status,lot_id) VALUES($1, $2,$3)";
      var values = [index, 0, lot];

      pool.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          //console.log(res.rows[0])
          //response.status(201).send(`Spots added `)
          // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
        }
      });
    }

    // callback
  }
};

const updateSD = (request, response) => {
  const id = parseInt(request.params.id);
  const { status, spot } = request.body;
  validate.create_spot_schema.validate({ jid: id, jstatus: status, jid: spot });

  const temp = validate.create_spot_schema.validate({
    jid: id,
    jstatus: status,
    jid: spot,
  });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(201)
      .send("Spot was not updated. Invalid entry. Please try again.");
  } else {
    pool.query(
      "UPDATE fms_parking_spot SET sd_status= $1,lot_id=$3 WHERE spot_no = $2",
      [status, spot, id],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`Spot modified with ID: ${id}`);
      }
    );
  }
};

const deleteSD = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM fms_parking_spot WHERE spot_no = $1",
    [id],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Spot deleted with ID: ${id}`);
    }
  );
};

module.exports = {
  getSD,
  getSDById,
  getSDBystatus,
  getSpot,
  leaveSpot,
  createSD,
  updateSD,
  deleteSD,
};
