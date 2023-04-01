//jwt is used to generate jwt token and verify jwt token,
// bcrypt module does 2 things:1) salting and hashing(hash verification as well)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("./../GlobalErrorConfig/appError");

const catchAsync = require("../GlobalErrorConfig/catchAsync");
const User = require("../Model/studentSchema");

//all functionality related to basic signup and login using jwt:
const signToken = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const verifyPassport = async (email, passport) => {
  const query = await User.findOne({ email: email }).select("passport");
  const match = await bcrypt.compare(passport, query.passport);
  return match;
};

const hashPassport = async (pass, saltVal = 10) => {
  const hash = await bcrypt.hash(pass, saltVal);
  return hash;
};

const loginControl = catchAsync(async (req, res) => {
  const { email, passport } = req.body;

  //1)check if email or passport exist:
  if (!email || !passport) {
    throw new AppError("email or passport not provided", 403);
  }
  //verify email and passport
  const match = await verifyPassport(email, passport);

  //if match==truthy,then verify token
  if (match) {
    //verify token:
    const token = await signToken(req.body);
    res.status(400).json({
      status: "sucess",
      token: "Bearer " + token,
    });
  } else {
    throw new AppError("Incorrect Passport", 400);
  }
});

const signupControl = catchAsync(async (req, res) => {
  const hash = await hashPassport(req.body.passport, 10);
  console.log(hash);
  req.body.passport = hash;
  req.body.passport_confirm = hash;
  console.log(req.body);
  const user = new User(req.body);
  const token = await signToken(req.body);
  user.save().then((savedDoc) => {
    res.status(200).json({
      status: "sucess",
      token: "Bearer " + token,
      ...savedDoc,
    });
  });
});

module.exports = { signupControl, loginControl, signToken };
