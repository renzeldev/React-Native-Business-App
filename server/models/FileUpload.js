const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileUploadSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  file: {
  	type: Object,
  	required: true
  }
})

module.exports = FileUpload = mongoose.model('fileupload', FileUploadSchema);
