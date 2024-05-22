const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  messageLog: [
    {
      handle: {
        type: String,
        required: true
      },
      log:{
        type: Array,
      }
    }
  ],
  uncheckmessageLog: [
    {
      handle: {
        type: String,
        required: true
      },
      log:{
        type: Array,
      }
    }
  ],
  meetingLog:[
    {
      date: {
        type: Date,
        default: Date.now
      },
      log:[
        {
          handle:{
            type: String,
            required: true
          },
          text:{
            type: String,
            required: true,
          },
        }
      ]    
    }
  ],
  FromEmail: [
    {
      handle: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      file: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now
      },
      emailType: {
        type: String,
      }
    }
  ],
  ToEmail:[
    {
      handle: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      file: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now
      },
      emailType: {
        type: String,
      }
    }
  ],
  NonReadEmail: [
    {
      handle: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      file: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now
      },
      emailType: {
        type: String,
      }
    }
  ]
})

module.exports = Chat = mongoose.model('chat', ChatSchema);
