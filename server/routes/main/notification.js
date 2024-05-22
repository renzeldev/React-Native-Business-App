const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Notification = require('../../models/Notification');
const notificationValidation = require('../../validation/notification');
const User = require('../../models/User');

router.get("/getCurrentNotification", passport.authenticate('jwt', {session:false}), (req, res) => {
  Notification.find()
  .then(notifications => {
    res.json(notifications[notifications.length-1]);
  })
})

router.post('/currentNotification/check', passport.authenticate('jwt', {session:false}), (req, res) => {
  User.findOne({handle:req.user.handle})
  .then(user => {
    user.notificationCheck = Date.now();
    user.save();
  })
})

router.get("/show/:number", passport.authenticate('jwt', {session:false}), (req, res) => {
  Notification.find()
  .then(notifications => {
    var data = [];
    if(notifications.length === 0) {
      res.json([]);
    }
    var number = req.params.number;
    for(var i = notifications.length-10*(number-1); i>notifications.length-10*number ; i-- ) {
       data = [...data, notifications[i-1]];
       if(i-1 === 0) break;
     }
    res.json(data);
  })
})

router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  const {errors, isValid} = notificationValidation(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  let data = [];
  Notification.find()
  .then(notifications => {
    for(var i = notifications.length;i>notifications.length-9;i--) {
      data = [...data, notifications[i-1]];
    }
  })
  const newNotification = new Notification ({
    title: req.body.title,
    content: req.body.content,
    upload: req.body.upload,
    dateNumber: Number(Date.now())
  });
  newNotification.save().then(notification => res.json([notification, ...data]));
  //res.json(newNotification);
  
  
})

router.get('/counts/notifications', passport.authenticate("jwt", {session:false}), (req, res) => {
  Notification.find()
  .then(notifications => {
    res.json(notifications.length)})
})

router.post('/edit/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  const {errors, isValid} = notificationValidation(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  Notification.findById(req.params.id)
  .then(notification => {
    const editData = {
      title: req.body.title,
      content: req.body.content,
      upload: req.body.upload,
      date: Date.now(),
      dateNumber: Number(Date.now())
    }
    Notification.findOneAndUpdate(
      {_id:req.params.id},
      {$set:editData},
      {new:true}
    ).then(noti => res.json(noti)).catch(err => res.json(err));
  })
  .catch(err=>res.json(err));
})

router.delete('/:id',passport.authenticate('jwt', {session:false}), (req, res) => {

  let errors = {};
  if(req.user.handle === 'admin') {
    Notification.findById(req.params.id)
    .then(notification => Notification.findOneAndRemove({_id: req.params.id}));
    res.json(req.params.id);
  } else {
    errors.notAllowed = '권한이 없습니다.'
    return res.status(404).json(errors);
  }
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  let temp = __dirname;
  //temp = temp.replace('BackEnd', '');
  
//   const fileDest = 'F:/upload/';
//   console.log('temp',temp, fileDest);
  const fileDest = path.join(__dirname, '/upload/');
      if(!fs.existsSync(fileDest)) {
          fs.mkdir(fileDest, { recursive:true}, function(err) {
              if(err) {
                  console.log(err);
                  cb(null, err);
              } else {
                  cb(null, fileDest)
              }
          })
      } else {
          cb(null, fileDest)
      }
  },
  filename: function (req, file, cb) {
  var arr = file.originalname.split('.');
  var ext = arr.pop();//arr의 제일 마지막 배렬
      var name;
      for(var i = 0; i< arr.length; i ++) {
    name += arr[i] + '.'
    
  }
  cb(null, file.originalname)
      // if(ext === undefined) {
      //     cb(null, name + '_' + Date.now())
      // } else {
      //     cb(null, name + ext)
      // }
  }
})

router.post('/upload/:file', (req, res) => {
   
  var upload = multer({storage: storage}).single('file');
  upload(req, res, (err) => {
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end(__dirname);
  })
})

router.get('/download/:file', (req, res) => {
  var path = __dirname +  '/upload/' + req.params.file;
  fs.exists(path, function(exists) {
    if(exists) {
      res.writeHead(200, {'content-type': 'application/zip'})
			fs.createReadStream(path).pipe(res); // 읽는 차제로 res로 client에 내려보냄.
    } else {
      res.status(400).json({err:'화일이 존재하지 않습니다!'});
    }
  })
})

module.exports = router;