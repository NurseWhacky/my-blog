const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please select a unique username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please insert a valid email address'],
    unique: [true, 'Email address already in use!'],
    validate: [validator.isEmail],
  },
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pwd) {
        return pwd === this.password;
      },
      message: 'Passwords are different!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  remainingLoginAttempts: Number,
  roles: {
    type: [String],
    enum: ['guest', 'user', 'author', 'mod', 'admin'],
    default: 'guest',
    // required: true,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  profilePicture: String, // for now
});

// middlewares
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 13);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  this.passwordChangedAt = Date.now() - 1000; // 1s delay
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check if password has been modified in the meantime
userSchema.methods.afterModifiedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const timestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < timestamp;
  }
  return false; // === password not changed
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
