const { Pool, Client } = require("pg");
const validate = require("./validate.js");
const connectionString = "postgresql://fms_admin:fmsadmin@localhost:5432/fms";
const pool = new Pool({
  connectionString: connectionString
});

const client = new Client({
  connectionString: connectionString
});

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

const getPDBycity = (request, response) => {
  const city = request.params.city;

  pool.query(
    "SELECT * FROM fms_parking_lot WHERE pd_loc_city = $1",
    [city],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPDByState = (request, response) => {
  const state = parseInt(request.params.state);

  pool.query(
    "SELECT * FROM fms_parking_lot WHERE pd_loc_state = $1",
    [state],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPDBypin = (request, response) => {
  const pin = parseInt(request.params.pin);

  pool.query(
    "SELECT * FROM fms_parking_lot WHERE pd_loc_pincode = $1",
    [pin],
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
  const { id, name, cood, city, state, add, pin, entry, exit } = request.body;
  validate.create_pd_schema.validate({
    jid: id,
    jname: name,
    jname: city,
    jname: state,
    jcood: cood,
    jadd: add,
    jpin: pin,
    jentry: entry,
    jentry: exit
  });

  const temp = validate.create_pd_schema.validate({
    jid: id,
    jname: name,
    jname: city,
    jname: state,
    jcood: cood,
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
      "INSERT INTO fms_parking_lot (pd_lot_id,pd_loc_cood,pd_loc_name,pd_loc_city,pd_loc_state,pd_loc_address,pd_loc_pincode,pd_entry,pd_exit) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9)";
    const values = [id, name, cood, city, state, add, pin, entry, exit];
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
  const { name, cood, city, state, add, pin, entry, exit } = request.body;
  const temp = validate.create_pd_schema.validate({
    jid: id,
    jname: name,
    jname: city,
    jname: state,
    jcood: cood,
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
      "UPDATE fms_parking_lot SET pd_loc_cood= $1, pd_loc_name = $2, pd_loc_city = $3,pd_loc_state =$4,pd_loc_address =$5,pd_loc_pincode =$6 ,pd_entry=$8,pd_exit=$9 WHERE pd_lot_id= $7",
      [name, cood, city, state, add, pin, id, entry, exit],
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
  getPDBycity,
  getPDByState,
  getPDBypin,
  createPD,
  updatePD,
  deletePD
};
