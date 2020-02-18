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
//     response.status(201).send(`User added with ID: ${result.insertId}`)
//   })
// }

const createPD = (request, response) => {
  console.log(request.body);
  const {
    id,
    name,
    add,
    pin,
    entry,
    exit,
    lon,
    lat,
    price,
    oid
  } = request.body;
  validate.create_pd_schema.validate({
    jid: id,
    jid: oid,
    jname: name,
    jprice: price,
    jcood: lon,
    jcood: lat,
    jadd: add,
    jpin: pin,
    jentry: entry,
    jentry: exit
  });

  const temp = validate.create_pd_schema.validate({
    jid: id,
    jid: oid,
    jname: name,
    jprice: price,
    jcood: lon,
    jcood: lat,
    jadd: add,
    jpin: pin,
    jentry: entry,
    jentry: exit
  });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(201)
      .send("Parking was not added. Invalid entry. Please try again.");
  } else {
    const text =
      "INSERT INTO fms_parking_lot (pd_lot_id,pd_loc_name,pd_loc_address,pd_loc_pincode,pd_entry,pd_exit,longitude,latitude,pd_hrly_rate,pd_owner_id) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10)";
    const values = [id, name, add, pin, entry, exit, lon, lat, price, oid];
    // callback
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
        response.status(201).send(`Parking added with ID: ${id}`);
        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      }
    });
  }
};

const updatePD = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, add, pin, entry, exit, lon, lat, price, oid } = request.body;
  const temp = validate.create_pd_schema.validate({
    jid: id,
    jid: oid,
    jname: name,
    jcood: lon,
    jcood: lat,
    jprice: price,
    jadd: add,
    jpin: pin,
    jentry: entry,
    jentry: exit
  });
  //console.log(temp.error)
  if (temp.error) {
    response
      .status(201)
      .send("Parking was not updated. Invalid entry. Please try again.");
  } else {
    pool.query(
      "UPDATE fms_parking_lot SET latitude= $1, pd_loc_name = $2, longitude = $3,pd_loc_address =$4,pd_loc_pincode =$5 ,pd_entry=$6,pd_exit=$8 ,pd_hrly_rate=$9, pd_owner_id=$10s WHERE pd_lot_id= $7",
      [lat, name, lon, add, pin, id, entry, exit, price, oid],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`Parking modified with ID: ${id}`);
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
