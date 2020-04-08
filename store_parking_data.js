const pool = require("./postgresql_connection.js").pool;

module.exports = function store_parking_data() {
  console.log("store_parking_data");
  setInterval(() => {
    console.log("Hello from store_parking_data");
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    pool.query(
      "SELECT * FROM fms_parking_lot_history",
      (error, results) => {
        if (error) {
          throw error;
        }

        for (record of results.rows) {
          // record = results.rows[0];
          // console.log(record);
          const values = [record.occupied_spot, record.pd_lot_id];

          pool.query(
            "SELECT * FROM fms_parking_lot_history WHERE pd_lot_id=$1 AND date = CURRENT_DATE",
            [record.pd_lot_id],
            (error, results) => {
              let queryText;
              if (error) {
                throw error;
              }

              if (results.rows.length == 0) {
                queryText = `insert into fms_parking_lot_history  (date,hour_${hour},pd_lot_id) values (CURRENT_DATE,$1,$2)`;
              } else {
                queryText = `UPDATE fms_parking_lot_history SET hour_${hour} = $1 WHERE pd_lot_id=$2 AND date = CURRENT_DATE`;
              }
              pool.query(queryText, values);
            }
          );
        }
      }
    );
  }, 3540000);
};
