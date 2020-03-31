const pool = require("./postgresql_connection.js").pool;
const validate = require("./validate.js");

const getPD = (request, response) => {
  pool.query(
    "SELECT * FROM fms_parking_lot ORDER BY pd_lot_id ASC",
    (error, results) => {
      if (error) {
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

const getPDByname = (request, response) => {
  const name = request.params.name;

  pool.query(
    "SELECT * FROM fms_parking_lot WHERE pd_loc_name = $1",
    [name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPDByOwner = (request, response) => {
  const id = request.params.id;
  pool.query(
    "SELECT * FROM fms_parking_lot where pd_owner_id =$1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
// const createUser = (request, response) => {
//   const { id,email,fname,lname, mobile } = request.body

//   pool.query('INSERT INTO fms_user (user_user_id,user_email_id,user_first_name,user_last_name, user_mobile_no) VALUES($1, $2,$3,$4,$5)', [ id,email,fname,lname, mobile], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).send(`User addressed with ID: ${result.insertId}`)
//   })
// }

const createPD = (request, response) => {
  console.log(request.body);
  const {
    name,
    address,
    pin,
    longitude,
    latitude,
    price,
    owner_id,
    total,
    occupied
  } = request.body;
  validate.create_pd_schema.validate({
    jid: owner_id,
    jname: name,
    jprice: price,
    jcood: longitude,
    jcood: latitude,
    jaddress: address,
    jpin: pin,
    jprice: total,
    jprice: occupied
  });

  const temp = validate.create_pd_schema.validate({
    jid: owner_id,
    jname: name,
    jprice: price,
    jcood: longitude,
    jcood: latitude,
    jaddress: address,
    jpin: pin,
    jprice: occupied,
    jprice: total
  });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(201)
      .send("Parking was not addressed. Invalid entry. Please try again.");
  } else {
    const text =
      "INSERT INTO fms_parking_lot (pd_loc_name,pd_loc_address,pd_loc_pincode,longitude,latitude,pd_hrly_rate,pd_owner_id,total_spot) VALUES($1, $2,$3,$4,$5,$6,$7,$8)";
    const values = [
      name,
      address,
      pin,
      longitude,
      latitude,
      price,
      owner_id,
      total
    ];
    // callback
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
        response.status(201).send(`Parking addressed with ID: ${id}`);
        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      }
    });
  }
};

//total is remaining

const updatePD = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, price } = request.body;
  validate.update_pd_schema.validate({
    jname: name,
    jprice: price
  });
  const temp = validate.update_pd_schema.validate({
    jid: id,
    jname: name,
    jprice: price
  });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(201)
      .send("Parking was not updated. Invalid entry. Please try again.");
  } else {
    pool.query(
      "UPDATE fms_parking_lot SET pd_loc_name = $2, pd_hrly_rate = $3 WHERE pd_lot_id = $1",
      [id, name, price],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`Parking Lot modified with ID: ${id}`);
      }
    );
  }
};

const deletePD = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM fms_parking_lot WHERE pd_lot_id = $1",
    [id],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Parking deleted with ID: ${id}`);
    }
  );
};

module.exports = {
  getPD,
  getPDById,
  getPDByname,
  getPDByOwner,
  createPD,
  updatePD,
  deletePD
};
