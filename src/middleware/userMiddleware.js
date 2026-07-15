const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Googleuser = require("../models/google");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Token is not present.");

    const payload = jwt.verify(token, process.env.JWT_KEY);

    const Model = payload.provider === "google" ? Googleuser : User;
    const result = await Model.findById(payload._id);

    if (!result) return res.status(401).send("User not found.");

    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) return res.status(401).send("Token is blocked.");

    req.result = result;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = userMiddleware;