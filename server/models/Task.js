const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  events: [
    {
      title: {
        type: String,
        required: true
      },
      backgroundColor: {
        type: String,
        required: true,
      },
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
      allDay: {
        type: Boolean,
      }
    }
  ],
  Tasks: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      tasks: [
        {
          title: {
            type: String,
            required: true
          },
          status: {
            type: Boolean,
          }
        }
      ]
    }
  ]
})

module.exports = Chat = mongoose.model('task', TaskSchema);
