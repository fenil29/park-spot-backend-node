const pool = require("./postgresql_connection.js").pool;
const validate = require("./validate.js");

const getHistory = (request, response) => {
  pool.query(
    "SELECT * FROM fms_parking_history ORDER BY user_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.user_id);

  pool.query(
    "SELECT * FROM fms_parking_history INNER JOIN fms_parking_lot ON fms_parking_history.parking_lot=fms_parking_lot.pd_lot_id where fms_parking_history.user_id = $1 ORDER BY out_time DESC",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows);
      response.status(200).json(results.rows);
    }
  );
};

// Also -

// try {
//     const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
// }
// catch (err) { }

const createhistory = (request, response) => {
  //console.log(request.body)
  const { userid, spotid, lotid } = request.body;

  const temp = validate.create_user_schema.validate({
    jid: userid,
    jid: spotid,
    jid: lotid,
  });
  console.log(temp.error);
  if (temp.error) {
    response
      .status(201)
      .send("User History was not added. Invalid entry. Please try again.");
  } else {
    const text =
      "INSERT INTO fms_parking_history (user_id,parking_lot,parking_spot) VALUES($1, $2,$3)";

    const values = [userid, spotid, lotid];
    // callback
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
        response.status(201).send(`User History added with ID: ${id}`);

        //   { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      }
    });
  }
};

const updateHistory = (request, response) => {
  const id = parseInt(request.params.id);
  const { spotid, lotid } = request.body;
  const temp = validate.create_user_schema.validate({
    jid: userid,
    jid: spotid,
    jid: lotid,
  });
  if (temp.error) {
    response
      .status(201)
      .send("User History was not updated. Invalid entry. Please try again.");
  } else {
    pool.query(
      "UPDATE fms_parking_history SET parking_spot = $2, parking_lot = $3 WHERE user_id = $1",
      [id, spotid, lotid],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`User History modified with ID: ${id}`);
      }
    );
  }
};

const deleteHistory = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM fms_parking_history WHERE user_id = $1",
    [id],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  );
};

module.exports = {
  getUserById,
  getHistory,
  createhistory,
  updateHistory,
  deleteHistory,
};
