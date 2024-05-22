const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EboardSchema = new Schema ({
  user: {
    type: String,
    required: true
  },
  title: {
    type:String,
    required: true
  },
  content: {
    type:String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  comments: [
    {
      handle: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  agree: [
    {
      user: {
        type: String,
        required: true
      }
    }
  ],
  disagree: [
    {
      user: {
        type: String,
        reqruied: true
      }
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  allowed: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Eboard = mongoose.model('eboard', EboardSchema);