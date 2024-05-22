const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuesSchema = new Schema ({
  user: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Ques = mongoose.model('quesandans', QuesSchema);