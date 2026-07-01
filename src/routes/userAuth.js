const express = require('express');
const authRouter = express.Router();
const { register, login, logout ,adminRegister} = require('../controllers/userAuthenticate');
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

module.exports = authRouter;