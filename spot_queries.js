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

  (async () => {
    const client = await pool.connect();
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    try {
      await client.query("BEGIN");
      const queryText =
        "SELECT min(spot_no) as spot_no from fms_parking_spot WHERE sd_status = 0 AND lot_id=$1";
      const res = await client.query(queryText, [id]);
      const updateStatus =
        "UPDATE fms_parking_spot SET sd_status = 1 WHERE lot_id=$1 AND spot_no =$2";
      const Values = [id, Number(res.rows[0]["spot_no"])];
      await client.query(updateStatus, Values);
      const values2 = [user,id, Number(res.rows[0]["spot_no"])];
      const updateInTime = "insert into fms_parking_history values ($1,$2,$3,CURRENT_TIMESTAMP,NULL)";
      await client.query(updateInTime, values2);
      await client.query("COMMIT");
      response.status(200).json(res.rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => console.error(e.stack));

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
    jid: spot
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
  createSD,
  updateSD,
  deleteSD
};
