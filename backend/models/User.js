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
  avatar: {
    type: String,
    default: 'http://static.tildacdn.com/tild3364-3662-4439-a262-313239363932/DSC_2841.jpg',
    validate: {
      validator: (value) => {
        const encodedUrl = encodeURI(value);
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(encodedUrl);
      },
      message: 'Invalid avatar URL',
    },
  },
  username: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 20,
    default: function() {
      return `@${this.email.split('@')[0]}`;
    },
    
  },
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


const User = mongoose.model('User', userSchema);

module.exports = User;
