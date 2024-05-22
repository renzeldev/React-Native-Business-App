const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateMessageSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  stateMessage: [
    {
      message: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
})

module.exports = StateMessage = mongoose.model('stateMessage', StateMessageSchema);