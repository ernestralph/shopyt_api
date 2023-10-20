const mongoose = require('mongoose')
const {objectId} = mongoose.Schema;
const bcrypt = require('bcryptjs')


let userSchema = mongoose.Schema({
 name: {
  type: String,
  required: [true, "Please add a name"]
 },
 email:{
  type:String,
  unique:[true,"Email already exists"],
  match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Please use a valid e-mail address'],
  required: [true, "Please add an email"]
 },
 password:{
  type:String,
  required: [true, "Please add a password"],
  minlength:[6, "Password must be up to 6 characters"],
 },
 role:{
  type : String, 
  required: [true],
  default : "customer",
  enum: ["customer", "admin"]
 },
 photo:{
  type: String,
  required: [true, "Please add a photo"],
  default: "https://i.ibb.co/4pDNDk1/avatar.png"
 },
 phone:{
  type: String,
  default:"+234",
 },
 address:{
  type: Object,
 }
});

userSchema.pre('save', async function(next){
 if(!this.isModified("password")){
  next();
 }else{
  // hash password
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
 }
})

const User = mongoose.model("User", userSchema);

module.exports = User;