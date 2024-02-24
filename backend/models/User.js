const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Юзер',
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  bio: {
    type: String,
    minlength: 5,
    maxlength: 150,
    default: 'описание',
  },
  age: {
    type: Number,
    maxlength: 2,
    default: 18,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
