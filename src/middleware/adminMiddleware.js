const jwt = require("jsonwebtoken");
const User = require('../models/user');
const Googleuser = require('../models/google');
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token is not present.");

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;
    if (!_id) throw new Error("Invalid token");

    if (payload.role != 'admin')
      throw new Error("Invalid Token..");

    const Model = payload.provider === "google" ? Googleuser : User;
    const result = await Model.findById(_id);

    if (!result) throw new Error("User does not exist");

    const IsBlocked = await redisClient.exists(`token:${token}`);
    if (IsBlocked) throw new Error("Token is blocked, please login again");

    req.result = result;
    req.userModel = payload.provider === "google" ? "Googleuser" : "User";
    next();
  } catch (err) {
    res.status(503).send("Error : " + err.message);
  }
};

module.exports = adminMiddleware;