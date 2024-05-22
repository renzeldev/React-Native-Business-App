const express = require('express');
const passport = require('passport');
const router = express.Router();
const StateMessage = require('../../models/StateMessage');

//router.get('/', (req, res) => {res.json("sesese")});

router.get('/getStateMessage', passport.authenticate('jwt', {session:false}), (req, res) => {
  StateMessage.findOne({user: req.user.handle})
  .then(item => {
    if(item) {
      res.json(item.stateMessage);
      item.stateMessage = [];
      item.save();
    } else {
      const newItem = new StateMessage({
        user: req.user.handle
      });
      newItem.save();
      res.json([]);
    }
  })
  .catch(err => {res.status(401).json(err)});
})

router.post('/sdf', passport.authenticate('jwt', {session:false}), (req, res) => {
  StateMessage.findOne({user: req.user.handle})
  .then(item => {
    if(item) {
      const newMessage = {
        message:"ddddddd"
      }
      item.stateMessage.unshift(newMessage);
      item.save();
      res.json(item);
    } else {
      const newItem = new StateMessage({
        user: req.user.handle,
        stateMessage: {
          message:"ddddddd",
          date: Date.now(),
        }
      });
      newItem.save();
      res.json(newItem);
    }
  })
})

module.exports = router;