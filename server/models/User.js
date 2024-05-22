const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true
  },
  work: {
    type: String,
  },
  citizen_card: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
  },
  others: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  notificationCheck: {
    type: Date,
  },
  // logo: {
  //   type: Boolean,
  // },
  logo: {
    type: String,
  },
   // mime: {
   //   type: String
   // }
})

module.exports = User = mongoose.model('users', UserSchema);