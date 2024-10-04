const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var validator = require('validator');

const HASHINGROUND = process.env.HASHINGROUND;
const SECRET_KEY = process.env.SECRET_KEY;

const publisher = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    trim:true,
    minlength: [2, "minimum 2 letters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
         throw new Error("Email is inValid")
      }
    }
  },
  number: {
    type: Number,
    required: true,
    unique: true,
    trim:true,
    minlength: [9, "not a valid number"],
    maxlength:[10,  "not a valid number"],
    validate(value){ 
      // console.log(value.length <= 9)
      if(value.length <= 9 ){
        throw new Error("invalid number ")
      } 
    }
  },
  password: {
    type: String,
    required: true,
    trim:true,
    minlength: [6, "password can't be less then 6 Characters"]
  },

  Profile_pic: {
    type:String,
    trim:true,
    default: null
  },

  UserType: {
    type:String,
    trim:true,
    required:true,
    default:'PUBLISHER'
  },

  OTP :{
    type: Number,
    default: null
  },

  isVerified:{
    type: Boolean,
    default: false
  },

  CreatedAt : {
    type: String,
    default: new Date().toLocaleString(),
  },
  
  FCM_Token: {
    type: Array 
   },
  
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  
});


// hashing the password
publisher.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(Number(HASHINGROUND),"==> Rounds");
    this.password = await bcrypt.hash(this.password, Number(HASHINGROUND));
    // this.cpassword = await bcrypt.hash(this.cpassword, Number(HASHINGROUND));
  }
  next();
});

// generating tockens
publisher.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id, email: this.email}, SECRET_KEY);
    // let refreshToken = jwt.sign({ _id: this._id, email: this.email}, SECRET_REFRESH_KEY);
    this.tokens = this.tokens.concat({ token: token });
    // this.tokens[0] = this.tokens[0] = { token: token };
    await this.save();
    // return token;
    return token;
  } catch (err) {
    console.log(err);
  }
};


// collection creation
const Publisher = mongoose.model("PUBLISHER", publisher);
// const Verify = mongoose.model("VERIFY", VerifySchema);

// exporting the modules
module.exports =  Publisher;
