const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const isLoggedIn = asyncHandler(async(req, res, next)=>{

 try {
  const token = req.cookies.token;
  if(!token){
   res.status(401)
   throw new Error('Not authenticated, pls login');
  }

  // Verify Token
  const isVerified = jwt.verify(token, process.env.JWT_SECRET);
  // get user id from token
  const user = await User.findById(isVerified.id).select("-password");
  // if user not found
  if (!user) {
  res.status(401);
  throw new Error('User not found');
  }

  req.user = user;
  next()
 } catch (error) {
  res.status(401);
  throw new Error('Not authenticated, pls login');
 }
});

module.exports = {
 isLoggedIn,
};