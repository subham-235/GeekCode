const express = require('express');
const authRouter = express.Router();
const { register, login, logout ,adminRegister,deleteProfile} = require('../controllers/userAuthenticate');
const userMiddleware=require('../middleware/userMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);

// Login
authRouter.post('/login', login);

// Logout
authRouter.post('/logout',userMiddleware, logout);

// Admin register
authRouter.post('/admin/register',adminMiddleware,adminRegister);

// Delete
authRouter.delete('/delete',userMiddleware,deleteProfile);

// Check-Auth
authRouter.get('/check',userMiddleware,async (req,res)=>{
    const reply={
      firstName:req.result.firstName,
      emailId:req.result.emailId,
      _id:req.result._id,
       role:req.result.role
    }
    res.status(200).json({
      user:reply,
      massage:"Valid User.."
    });
})
module.exports = authRouter;