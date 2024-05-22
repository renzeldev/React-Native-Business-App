const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');
const Discuss = require('../../models/Discuss');
const Chat = require('../../models/Chat');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {registerValidation, editRegisterValidation} = require('../../validation/register');
//const {editRegisterValidation} = require('../../validation/register');
const loginValidation = require('../../validation/login');
const keys = require('../../config/keys');
const fs = require('fs');
const Writable = require('stream').Writable;
const util = require('util');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  let temp = __dirname;
  const folderpath = '\\web\\Project\\HySB1\\client\\public';
  const fileDest = path.join(folderpath, '/avatar');
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
  }
})

router.post('/avatar',  (req, res) => {
   
  var upload = multer({storage: storage}).single('file');
  upload(req, res, (err) => {
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end(__dirname);
  })
})

router.get('/test', (req, res) => {
  console.log("sdfsdf"); 
  res.json({msg: 'Users works'})
});
router.post('/register', (req, res) => {
  console.log(req.body);
  // const {errors, isValid} = registerValidation(req.body);
  // if(!isValid) {
  //   return res.status(400).json(errors);
  // }
  User.findOne({handle: req.body.handle})
  .then(user => {
    if(user) {
      errors.handle = "그 식별자는 이미 존재합니다."
      return res.status(400).json(errors);
    } else {
      // console.log(typeof(req.body.image));
      if(!req.body.image) {
        const folderpath = '\\web\\Project\\HySB1\\client\\public';
        const fileDest = path.join(folderpath, '/avatar');
        var rs = fs.createReadStream(req.body.gender == 'male' ? 'man_default.png' : 'woman_default.png');
        var ws = fs.createWriteStream(fileDest + '/' + req.body.handle + '.' + 'png');
        rs.pipe(ws);
      }
      const newUser = new User({
        name: req.body.name,
        handle: req.body.handle,
        birthday: req.body.birthday,
        gender: req.body.gender, 
        work: req.body.work,
        citizen_card: req.body.citizen_card,
        password: req.body.password,
        phone_number: req.body.phone_number,
        others: req.body.others,
        // logo: req.body.image ? true:false,
        logo: req.body.image? req.body.image : req.body.handle + '.png',
      });

      // if(req.body.image) {
      //   const path = __dirname + '/avatar';
      //   var ws = fs.createWriteStream()
      // }
      //res.json(newUser);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;

          //토론마당추가
          const newDiscuss = new Discuss({
            user: req.body.handle
          })
          const newChat = new Chat({
            user: req.body.handle
          })
          newChat.save();
          newDiscuss.save();
          //res.json(newUser);
          // User.find()
          // .then(users => users.unshift(newUser));
          // res.json(newUser);
          newUser.save().then(user => {
            // console.log(user);
            if(req.body.image) {
              // var formData = new FormData();
              // formData.append('file', req.body.image);
              var folderpath = __dirname + `/avatar/${user._id}`;
              // var path = folderpath + req.params.filename;
              const ws = fs.createWriteStream(folderpath);
              ws.write(req.body.image);
              ws.end();
            }
            res.json(user);
          }).catch(err => console.log(err));
        })
      })
    }
  })
});

router.post('/login', (req, res) => {
  console.log(req.body);
  const {errors, isValid} = loginValidation(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  //admin authenticate
  if(req.body.handle === "admin") {
    if(req.body.password === "10141014") {
      const payload = {
        handle: "admin",
        name: '체계관리자',
        id: '19981014'
      };
      jwt.sign(payload, keys.secretOrKey, {expiresIn:360000}, (err, token) => {
        res.status(200).json({success: true, token:"Bearer "+ token});//set as bearer token //token must be 'Bearer ' + token 
      })
    }
  } else {
  User.findOne({handle: req.body.handle})
  .then(user => {
    if(!user) {
      errors.handle = '그런 식별자는 존재하지 않습니다.';
      return res.status(404).json(errors);
    }
    bcrypt.compare(req.body.password, user.password)
    .then(isMatch => {
      if(isMatch) {
        const payload = {
          handle: user.handle,
          name: user.name,
          id: user._id,
          password: user.password,
          notificationCheck: user.notificationCheck,
          isNotificationChecked: false,
          isTodayEventChecked: false,
          locked:false,
          image: user.logo
        };
        // console.log(user.logo);
        jwt.sign(payload, keys.secretOrKey, {expiresIn:360000}, (err, token) => {
          console.log(payload);
          res.status(200).json({status: 'success', token:"Bearer "+ token, payload: payload});//set as bearer token //token must be 'Bearer ' + token 

        });
      } else {
        errors.password = '암호가 맞지 않습니다.'
        return res.status(404).json(errors);
      }
    })
  })}
})



router.get('/profile/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  console.log(req);
  User.findOne({handle: req.params.handle})
  .then(user => {
    if(user) {
      const payload = {
        name: user.name,
        handle: user.handle,
        birthday: user.birthday,
        gender: user.gender,
        work: user.work,
        citizen_card: user.citizen_card,
        phone_number: user.phone_number,
        others: user.others,
        notificationCheck: user.notificationCheck
      }

      res.json(payload);
    }
  })
  .catch(err => res.status(404).json(err));
})

// router.post('/getprofile', passport.authenticate('jwt', {session:false}), (req, res) => {
//   console.log(req);
//   User.findOne({handle: req.body.handle})
//   .then(user => {
//     if(user) {
//       const payload = {
//         name: user.name,
//         handle: user.handle,
//         birthday: user.birthday,
//         gender: user.gender,
//         work: user.work,
//         citizen_card: user.citizen_card,
//         phone_number: user.phone_number,
//         others: user.others,
//         notificationCheck: user.notificationCheck
//       }

//       res.json(payload);
//     }
//   })
//   .catch(err => res.status(404).json(err));
// })

router.post('/profile/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  
  const {errors, isValid} = editRegisterValidation(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  let editProfile = {};
  User.findOne({handle: req.params.handle})
  .then(user => {
    if(user) {
      
      bcrypt.compare(req.body.password, user.password)
      .then(isMatch => {
        if(isMatch) {
          editProfile.name = req.body.name;
          editProfile.handle = req.body.handle;
          editProfile.citizen_card = req.body.citizen_card;
          editProfile.gender = req.body.gender;
          editProfile.birthday = req.body.birthday;
          editProfile.work = req.body.work;
          editProfile.phone_number = req.body.phone_number;
          editProfile.others = req.body.others;
          if(req.body.newpassword !== "") {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
                if(err) throw err;
                editProfile.password = hash;
                User.findOneAndUpdate(
                  {handle: req.params.handle},
                  {$set: editProfile},
                  {new: true}
                ).then(user => res.json(user));
              })
            })
          } else {
            editProfile.password = user.password;
            User.findOneAndUpdate(
              {handle: req.params.handle},
              {$set: editProfile},
              {new: true}
            ).then(user => res.json(user));
          }
        } else {
          errors.password = "암호가 정확하지 않습니다."
          return res.status(400).json(errors);
        }
      })
      .catch(err => res.status(400).json(err));
    }
  })
})

router.get('/wasan/download/', (req, res) => {
  console.log("sdfdfdf");
  var path = __dirname + '/wasan.zip';
  fs.exists(path, function(exists) {
    if(exists) {
      res.writeHead(200, {'content-type':'application/zip'});
      fs.createReadStream(path).pipe(res);
    } else {
      return res.status(404).json({err:"화일을 찾을수 없습니다"});
    }
  })
})

module.exports = router;