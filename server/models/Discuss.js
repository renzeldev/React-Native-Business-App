const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscussSchema = new Schema({
  user:{
    type: String,
    required: true
  },
  friend: [
    {
      handle:{
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Discuss = mongoose.model('discuss', DiscussSchema);