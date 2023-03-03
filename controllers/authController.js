const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// authentication: signup and login

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    profilePicture: req.body.profilePicture,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.login = (req, res, next) => {};
