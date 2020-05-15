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
const getPLHistoryByMonth = (request, response) => {
  const { lotid, month, year } = request.body;
  console.log("body", request.body);
  pool.query(
    "SELECT EXTRACT(DAY FROM date) as day,hour_0,hour_1,hour_2,hour_3,hour_4,hour_5,hour_6,hour_7,hour_8,hour_9,hour_10,hour_11,hour_12,hour_13,hour_14,hour_15,hour_16,hour_17,hour_18,hour_19,hour_20,hour_21,hour_22,hour_23 FROM public.fms_parking_lot_history WHERE EXTRACT(MONTH FROM date)=$1 AND EXTRACT(YEAR FROM date)=$2AND pd_lot_id=$3 ORDER BY date ASC",
    [month, year, lotid],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      let result = results.rows;
      let resultDayAverage = {};
      for (let i of result) {
        let tempDay = i.day;
        delete i.day;
        let tempTotal = 0;
        for (let j in i) {
          tempTotal = tempTotal + i[j];
        }
        dayAvg = (tempTotal / 24).toFixed(2);
        resultDayAverage[tempDay] = dayAvg;
      }
      console.log(resultDayAverage);
      response
        .status(200)
        .json(
          results.rows.length == 0
            ? "not available"
            : { ...resultDayAverage, type: "month", month, year }
        );
    }
  );
};
module.exports = {
  getPLHistory,
  getPLHistoryByMonth,
};
