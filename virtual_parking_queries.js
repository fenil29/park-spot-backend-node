const pool = require("./postgresql_connection.js").pool;
const validate = require("./validate.js");

const getPD = (request, response) => {
  
  pool.query(
    "SELECT * FROM fms_parking_lot ORDER BY pd_lot_id ASC",
    (error, results) => {
      if (error) {
        response.status(200).json("results.rows");
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPDById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM fms_parking_lot WHERE pd_lot_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const getPDSpots = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT sd_status,spot_no FROM fms_parking_spot WHERE lot_id = $1 ORDER BY spot_no ASC",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
module.exports = {
  getPD,
  getPDById,
  getPDSpots,
};
