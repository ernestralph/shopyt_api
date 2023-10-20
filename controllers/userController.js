const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");


//generate token functionality
const generateToken = (id)=>{
 return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

//register
const registerUser = asyncHandler(async(req, res)=>{
 const {name, email, password} = req.body;

 // Validations
 if(!name || !email || !password) {
   res.status(400);
   throw new Error('Please provide all required fields');
 };
 // Check for password is up to req characters
 if(password.length < 6) {
   res.status(400);
   throw new Error('Password must be up to 6 characters');
 };
 // Check for existing user object
 const foundUser = await User.findOne({email});
 if(foundUser) {
   res.status(400);
   throw new Error('Email has already been taken');
 };
 //create new user
 const user = await User.create({
  name,
  email,
  password
 });

 // generate token
 const token = generateToken(user._id);

 if(user){
  const {_id, name, email, role} = user;
  res.cookie("token", token,{
   httpOnly: true,
   expires: new Date(Date.now() + 1000 + 86400),
   // secure:true,
   // sameSite: none,
  });
  // send user data
  res.status(201).json({
   _id, 
   name, 
   email, 
   role,
   token
  });
 }else{
  res.status(500);
  throw new Error('Error creating a new user')
 }
});


// Login user
const loginUser = asyncHandler(async(req, res)=>{
 const {email, password} = req.body;

 // validate user or request
 if(!email || !password ) {
  res.status(400);
  throw new Error('Please provide an email and password');
 }
 // check if user exist
 const user = await User.findOne({email}).select('+password');
 if (!user) {
  res.status(401);
  throw new Error('Invalid credentials');
 }
 // check is password exist
 const passwordExist = await bcrypt.compare(password, user.password);

 // generate token
 const token = generateToken(user._id);
 
 if (user && passwordExist) {
  res.cookie("token", token,{
   httpOnly: true,
   expires: new Date(Date.now() + 86400 * 1000),
   // secure:true,
   // sameSite: none,
  });
  // send user data
  const {password, ...userData} = user._doc
  res.status(201).json(userData);
 } else{
  res.status(401);
  throw new Error('Invalid credentials');
 }
});

const logoutUser = asyncHandler(async(req, res)=>{
 res.cookie("token", '',{
   httpOnly: true,
   expires: new Date(0),
   // secure:true,
   // sameSite: none,
  });
  return res.status(200).json({msg: "Successfully Logged Out"});
});

// get user
const getUser = asyncHandler(async(req,res)=>{
 const user = await User.findById(req.user._id).select("-password");
 if(user){
  return res.status(200).json(user);
 }
 else{
  res.status(400);
  throw new Error('No user found')

 }
});

// get login status
const getLoginStatus = asyncHandler(async(req, res)=>{
  // get token
  const token = req.cookies.token;
  if(!token){
   return res.json(false)
  }

  // Verify Token
  const isVerified = jwt.verify(token, process.env.JWT_SECRET);
  if(isVerified){
   return res.json(true)
  }else{
    return res.json(false)
  }

});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const {name, phone, address} = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    
    const updatedUser = await user.save();
    const {password, ...newUpdatedUser} = updatedUser._doc;
    res.status(200).json(newUpdatedUser);
  }else{
    res.status(401);
    throw new Error('User not found authorized');
  }
});

// update user profile photo
const updateProfilePhoto = asyncHandler(async (req, res) => {
  const {photo} = req.body;
  const user = await User.findById(req.user._id);
  user.photo = photo;

  const updateUser = await user.save();
  const {password, ...updatedUser} = updateUser._doc;
  res.status(200).json({...updatedUser});
});


module.exports = {
 registerUser,
 loginUser,
 logoutUser,
 getUser,
 getLoginStatus,
 updateUser,
 updateProfilePhoto
};