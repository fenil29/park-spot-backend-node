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
  const { email, pass, fname, lname, access } = request.body;

  validate.create_user_schema.validate({
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,
    jaccess: access,
  });
  validate.create_user_schema.validate({});
  const temp = validate.create_user_schema.validate({
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,
    jaccess: access,
  });
  //console.log(temp.error);
  // const emailvalidation =
  //   "Select user_email_id from fms_user where user_email_id=$1";
  // const emailvalue = [email];
  // // callback
  // pool.query(emailvalidation, emailvalue, (err, res) => {
  //   if (emailvalidation.rows != null) {
  //     response.status(400).send(`User already exists.`);
  //   } else {
  if (temp.error) {
    response
      .status(201)
      .send(
        "User was not added. Invalid entry. Please Enter proper details and Password of minimum 5 characters."
      );
  } else {
    //user id
    let userid;
    userid = "SELECT max(user_user_id) as user_user_id from fms_user";
    pool.query(userid, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        userid = parseInt(res.rows[0].user_user_id);
        console.log(parseInt(res.rows[0].user_user_id));
      }

      const text =
        "INSERT INTO fms_user (user_password,user_email_id,user_first_name,user_last_name,access_right, user_user_id) VALUES($1, $2,$3,$4,$5,$6)";

      const values = [pass, email, fname, lname, access, userid + 1]; //access,access_right,
      // callback
      pool.query(text, values, (err, res) => {
        if (err) {
          response.status(201).send("Email-id already exists.");
        } else {
          console.log(res.rows[0]);
          response.status(201).send(`User added`);

          //   { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
        }
      });
    });
  }
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { pass, email, fname, lname, access } = request.body;
  validate.create_user_schema.validate({
    jid: id,
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,

    jaccess: access,
  });
  validate.create_user_schema.validate({});
  const temp = validate.create_user_schema.validate({
    jid: id,
    jpass: pass,
    jname: fname,
    jname: lname,
    jemail: email,

    jaccess: access,
  });
  if (temp.error) {
    response
      .status(201)
      .send("User was not updated. Invalid entry. Please try again.");
  } else {
    pool.query(
      "UPDATE fms_user SET user_email_id= $1,user_first_name = $2, user_last_name = $3, user_password =$5 ,access_right=$6 WHERE user_user_id = $4",
      [email, , fname, lname, id, pass, access],
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
  deleteUser,
};
