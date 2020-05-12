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
  const { email, pass } = request.body;
  validate.login_schema.validate({ jemail: email, jpass: pass });
  validate.login_schema.validate({});
  const temp = validate.login_schema.validate({ jemail: email, jpass: pass });
  if (temp.error) {
    response.status(400).send("invalid data");
  } else {
    pool.query(
      "SELECT * FROM fms_user WHERE user_email_id = $1 AND user_password=$2",
      [email, pass],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          if (results && results.rows == 0) {
            response
              .status(400)
              .send("Please enter correct E-mail or password");
          } else {
            user = results.rows[0];
            // delete user["user_mobile_no"];
            delete user["user_password"];
            response.status(200).json(user);
          }
        }
      }
    );
  }
};

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
  if (temp.error) {
    response
      .status(400)
      .send(
        "User was not added. Invalid entry. Please Enter proper details and Password of minimum 5 characters."
      );
  } else {
    //for inserting user
    client.query("BEGIN");
    const text =
      "INSERT INTO fms_user (user_password,user_email_id,user_first_name,user_last_name,access_right) VALUES($1, $2,$3,$4,$5)";

    const values = [pass, email, fname, lname, access];
    client.query(text, values, (err, res) => {
      if (err) {
        response.status(400).json({ error_message: "Email-id already exists" });
      } else {
        console.log("User Added...");
        //for getting details of user
        const user = "SELECT * from fms_user WHERE user_email_id = $1";
        client.query(user, [email], (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res.rows);
            userdetail = res.rows[0];
            //delete user["user_mobile_no"];
            delete userdetail["user_password"];
            response.status(201).json(userdetail);
          }
        });
      }
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
      .status(400)
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
