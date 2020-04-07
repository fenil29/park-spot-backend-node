const pool = require("./postgresql_connection.js").pool;
const validate = require("./validate.js");

const getUsers = (request, response) => {
  pool.query(
    "SELECT * FROM fms_user ORDER BY user_user_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM fms_user WHERE user_user_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserByfname = (request, response) => {
  const fname = request.params.fname;

  pool.query(
    "SELECT * FROM fms_user WHERE user_first_name = $1",
    [fname],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserBylname = (request, response) => {
  const lname = request.params.lname;

  pool.query(
    "SELECT * FROM fms_user WHERE user_last_name = $1",
    [lname],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const login = (request, response) => {
  const { id, pass } = request.body;
  validate.login_schema.validate({ jid: id, jpass: pass });
  validate.login_schema.validate({});
  const temp = validate.login_schema.validate({ jid: id, jpass: pass });
  if (temp.error) {
    response.status(400).send("Please enter correct id or password.");
  } else {
    pool.query(
      "SELECT * FROM fms_user WHERE user_user_id = $1 AND user_password=$2",
      [id, pass],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          if (results && results.rows == 0) {
            response.status(400).send("Please enter correct id or password");
          } else {
            user = results.rows[0];
            delete user["user_mobile_no"];
            delete user["user_password"];
            response.status(200).json(user);
          }
        }

        // console.log(results.rows.length)
        //   if (results.rows.length==1) {
        //   response.status(200).json(results.row)
        // }
        // else {

        //   response.status(201).send("User was not found. Please signup or try again.")

        // }
      }
    );
  }
};

// Also -

// try {
//     const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
// }
// catch (err) { }

const createUser = (request, response) => {
  //console.log(request.body)
  const { id, email, pass, fname, lname, mobile, access } = request.body;

  validate.create_user_schema.validate({
    jid: id,
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,
    jmobile: mobile,
    jaccess: access
  });
  validate.create_user_schema.validate({});
  const temp = validate.create_user_schema.validate({
    jid: id,
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,
    jmobile: mobile,
    jaccess: access
  });
  console.log(temp.error);
  if (temp.error) {
    response
      .status(400)
      .send("User was not added. Invalid entry. Please try again.");
  } else {
    const text =
      "INSERT INTO fms_user (user_user_id,user_password,user_email_id,user_first_name,user_last_name, user_mobile_no,access_right) VALUES($1, $2,$3,$4,$5,$6,$7)";

    const values = [id, pass, email, fname, lname, mobile, access];
    // callback
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
        response.status(201).send(`User added with ID: ${id}`);

        //   { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      }
    });
  }
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { pass, email, fname, lname, mobile, access } = request.body;
  validate.create_user_schema.validate({
    jid: id,
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,
    jmobile: mobile,
    jaccess: access
  });
  validate.create_user_schema.validate({});
  const temp = validate.create_user_schema.validate({
    jid: id,
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,
    jmobile: mobile,
    jaccess: access
  });
  if (temp.error) {
    response
      .status(201)
      .send("User was not updated. Invalid entry. Please try again.");
  } else {
    pool.query(
      "UPDATE fms_user SET user_email_id= $1,user_first_name = $2, user_last_name = $3,user_mobile_no =$4, user_password =$6 ,access_right=$7 WHERE user_user_id = $5",
      [email, , fname, lname, mobile, id, pass, access],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`User modified with ID: ${id}`);
      }
    );
  }
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM fms_user WHERE user_user_id = $1",
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
  getUsers,
  getUserById,
  getUserByfname,
  getUserBylname,
  login,
  createUser,
  updateUser,
  deleteUser
};
