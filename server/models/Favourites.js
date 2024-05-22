const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavouriteSchema = new Schema ({
  user: {
    type: String,
    required: true
  },
  list: {
      type: Array
  }
});

module.exports = Favourites = mongoose.model('favourites', FavouriteSchema);