const jsonwebtoken = require("jsonwebtoken");
const { jwtKey } = require("./config.js");


const verifyToken = async (req, res, next) => {
  console.log(req.headers && req.headers["jwt-token"]);

  const token = (req.headers && req.headers["jwt-token"]) || "";
  try {
    if (!token) {
      return res.status(401).json("You need to Login");
    }
    const decrypt = await jsonwebtoken.verify(token, jwtKey);
    req.userData = decrypt;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json("error");
  }
};
const verifyOwnerId = async (req, res, next) => {
  try {
    console.log("req.userData", req.userData);
    if (req.userData.user_user_id != req.params.owner_id) {
      return res.status(403).json("Forbidden");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json("error");
  }
};
const verifyUserId = async (req, res, next) => {
  try {
    console.log("req.userData", req.userData);
    if (req.userData.user_user_id != req.params.user_id) {
      return res.status(403).json("Forbidden");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json("error");
  }
};

module.exports = {
  verifyToken,
  verifyOwnerId,
  verifyUserId
};
