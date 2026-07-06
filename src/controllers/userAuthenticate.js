const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission=require('../models/submission');

// Register
const register = async (req, res) => {
  try {
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role='user';

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId: emailId ,role:user.role},
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
      const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
       role:user.role
    }

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user:reply,
      massage:"Registered Successfully..."
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

// Login
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) throw new Error("Invalid Credentials");
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) 
        throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { _id: user._id, emailId: emailId ,role:user.role},
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
       role:user.role
    }
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user:reply,
      massage:"Login Successfully..."
    });
  } catch (err) {
    res.status(401).send("Error : " + err.message);
  }
};

// Logout
const logout = async (req, res) => {
  try {
// Validate the token
const {token}=req.cookies;


const payload=jwt.decode(token);

await redisClient.set(`token:${token}`,'Blocked');
await redisClient.expireAt(`token:${token}`,payload.exp);

res.cookie("token",null,{expires:new Date(Date.now())});
res.send("Logged out Successfully...")
  } catch (err) {
    res.status(503).send("Error : " + err.message);
  }
};

// admin register
const adminRegister= async (req,res)=>{
   try {
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role='admin';

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId: emailId ,role:user.role},
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully...");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
}

// Profile Delete
const deleteProfile = async (req,res)=>{
  try{
const userId=req.result._id;
// Deleted from user schema
await User.findByIdAndDelete(userId);
// Deleted from submission.
await Submission.deleteMany({userId});

res.status(200).send("Deleted Successfully....")
  }catch(err){
  return res.status(500).send("Internal Server Error...")
  }
}
module.exports = { register, login, logout ,adminRegister,deleteProfile};