const pool = require("./postgresql_connection.js").pool;

setInterval(() => {
  console.log("Hello from store_parking_data");
  let now = new Date();
  let hour = 1;
  if (hour == 1) {
    pool.query("SELECT * FROM fms_parking_lot", (error, results) => {
      if (error) {
        throw error;
      }
      for (record of results.rows) {
        console.log(record);
        const values = [record.pd_lot_id, record.occupied_spot];
        const insertFirstTime =
          "insert into fms_parking_lot_history  (data,pd_lot_id,hour_1) values (CURRENT_DATE,$1,$2)";
        pool.query(insertFirstTime, values);
      }
    });
  } else {
    pool.query("SELECT * FROM fms_parking_lot", (error, results) => {
      if (error) {
        throw error;
      }
      for (record of results.rows) {
        console.log(record);

        const values2 = [hour, record.occupied_spot, record.pd_lot_id];
        const updateHourly =
          "UPDATE fms_parking_lot_history SET hour_$1 = $2 WHERE pd_lot_id=$3 AND date = CURRENT_DATE";
        pool.query(updateHourly, values2);
      }
    });
  }

  // }, 3540000);
}, 1000);
