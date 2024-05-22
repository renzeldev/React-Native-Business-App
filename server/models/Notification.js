const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  upload: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  dateNumber: {
    type: Number,
  }
})

module.exports = Notification = mongoose.model('notification', NotificationSchema)