const pool = require("./postgresql_connection.js").pool;
const validate = require("./validate.js");

const getPLHistory = (request, response) => {
  const { date, lotid } = request.body;

  pool.query(
    "SELECT * FROM fms_parking_lot_history  where date = $1 AND pd_lot_id=$2",
    [date, lotid],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows);
      response
        .status(200)
        .json(
          results.rows[0]
            ? { ...results.rows[0], type: "day" }
            : "not available"
        );
    }
  );
};

module.exports = {
  getPLHistory,
};
