const express = require('express');
const router = express.Router();
const passport = require('passport');
const Validator = require('validator');
const isEmpty = require('../../validation/is-empty');
const User = require('../../models/User');
const Discuss = require('../../models/Discuss');
const StateMessage = require('../../models/StateMessage');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const compareString = require('../../config/compareString');

router.post('/search', passport.authenticate('jwt', {session:false}), (req, res) => {
  let filteredFriends;
  console.log(req.body);
  User.find()
  .then(users => {
    filteredFriends = users.filter(item => item.handle !== req.user.handle);
    filteredFriends = filterUsersByHandle(filteredFriends, req.body.handle);
    filteredFriends = filterUsersByName(filteredFriends, req.body.name);
    filteredFriends = filterUsersByGender(filteredFriends, req.body.gender);
    filteredFriends = filterUsersByPhone(filteredFriends, req.body.phone_number);
    Discuss.findOne({user: req.user.handle})
    .then(discuss => {
      if(discuss) {
        filteredFriends = filterUsersByFriend(filteredFriends, discuss.friend);
        filteredFriends.map(item => item.logo ? item.logo = "" : null);
        res.json(filteredFriends);
      } else {
        console.log(filteredFriends);
        filteredFriends.map(item => item.logo ? item.logo = "" : null);
        res.json(filteredFriends);
      }
      //res.json(filteredFriends);
      
    })
  })
})

router.get('/getfriend', passport.authenticate('jwt', {session:false}), (req, res) => {
  Discuss.findOne({user: req.user.handle})
  .then(discuss => {
    if(discuss) {
      console.log(discuss.friend);
      res.json(discuss.friend);
    } else {
      const newDiscuss = new Discuss({
        user: req.user.handle
      })
      newDiscuss.save();
      res.json([]);
    }
  })
})

router.post('/invite', passport.authenticate('jwt', {session:false}), (req, res) => {
  // console.log(req.body);
  Discuss.findOne({user: req.user.handle})
  .then(discuss => {
    const newFriend = {
      handle: req.body.handle,
      name: req.body.name,
      gender: req.body.gender,
      type: "request"
    }
    Discuss.findOne({user:req.body.handle})
    .then(discuss => {
      User.findOne({handle:req.user.handle})
      .then(user => {
        const newComingFriend = {
          handle: user.handle,
          name: user.name,
          gender: user.gender,
          type: "receive"
        }
        discuss.friend.unshift(newComingFriend);
        discuss.save();
        StateMessage.findOne({user: req.body.handle})
        .then(item => {
          if(item) {
            const message = {
              message: user.handle + "동지가 친구요청을 하였습니다."
            }
            item.stateMessage.unshift(message);
            item.save();
          } else {
            const newItem = new StateMessage({
              user: req.body.handle,
              stateMessage: {
                message: user.handle + "동지가 친구요청을 하였습니다.",
                date: Date.now(),
              }
            });
            newItem.save();
          } 
        })
      })
    })
    discuss.friend.unshift(newFriend);
    discuss.save().then(discuss => {
      console.log(discuss);
      res.json(discuss.friend[0]);
    });
    //res.json(discuss.friend);
  })
})

router.post('/agreefriend', passport.authenticate('jwt', {session:false}), (req, res) => {
  Discuss.findOne({user: req.user.handle})
  .then(discuss => {
    discuss.friend.map(item => {
      if(item.handle === req.body.handle) {
        item.type = "friend"
      }
    });
    discuss.save();
    Discuss.findOne({user: req.body.handle})
    .then(discuss => {
      discuss.friend.map(item => {
        if(item.handle === req.user.handle) {
          item.type = "friend";
        }
      })
      discuss.save();
      StateMessage.findOne({user: req.body.handle})
        .then(item => {
          if(item) {
            const message = {
              message: req.user.handle + "동지가 친구요청을 승인하였습니다."
            }
            item.stateMessage.unshift(message);
            item.save();
          } else {
            const newItem = new StateMessage({
              user: req.body.handle,
              stateMessage: {
                message: req.user.handle + "동지가 친구요청을 승인하였습니다.",
                date: Date.now(),
              }
            });
            newItem.save();
          } 
        })
    })
    res.json(discuss.friend);
  })
})

router.post('/erase/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Discuss.findOne({user: req.user.handle})
  .then(discuss => {
    const removeIndex = discuss.friend.map(item => item.handle.toString()).indexOf(req.params.handle);
    discuss.friend.splice(removeIndex, 1);
    discuss.save();
    Discuss.findOne({user: req.params.handle})
    .then(discuss => {
      const removeIndex = discuss.friend.map(item => item.handle.toString()).indexOf(req.user.handle);
      discuss.friend.splice(removeIndex, 1);
      discuss.save();
      StateMessage.findOne({user: req.params.handle})
        .then(item => {
          if(item) {
            const message = {
              message: req.user.handle + "동지가 친구관계를 해제하였습니다."
            }
            item.stateMessage.unshift(message);
            item.save();
          } else {
            const newItem = new StateMessage({
              user: req.params.handle,
              stateMessage: {
                message: req.user.handle + "동지가 친구관계를 해제하였습니다.",
                date: Date.now(),
              }
            });
            newItem.save();
          } 
        })
    })
    res.json(discuss.friend);
  })
})

router.post('/cancelRequest/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Discuss.findOne({user: req.user.handle})
  .then(discuss => {
    const removeIndex = discuss.friend.map(item => item.handle.toString()).indexOf(req.params.handle);
    discuss.friend.splice(removeIndex, 1);
    discuss.save();
    Discuss.findOne({user: req.params.handle})
    .then(discuss => {
      const removeIndex = discuss.friend.map(item => item.handle.toString()).indexOf(req.user.handle);
      discuss.friend.splice(removeIndex, 1);
      discuss.save();
      StateMessage.findOne({user: req.params.handle})
        .then(item => {
          if(item) {
            const message = {
              message: req.user.handle + "동지가 친구요청을 거부하였습니다."
            }
            item.stateMessage.unshift(message);
            item.save();
          } else {
            const newItem = new StateMessage({
              user: req.params.handle,
              stateMessage: {
                message: req.user.handle + "동지가 친구요청을 거부하였습니다.",
                date: Date.now(),
              }
            });
            newItem.save();
          } 
        })
    })
    res.json(discuss.friend);
  })
})

router.post('/cancelInvite/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Discuss.findOne({user: req.user.handle})
  .then(discuss => {
    const removeIndex = discuss.friend.map(item => item.handle.toString()).indexOf(req.params.handle);
    discuss.friend.splice(removeIndex, 1);
    discuss.save();
    Discuss.findOne({user: req.params.handle})
    .then(discuss => {
      const removeIndex = discuss.friend.map(item => item.handle.toString()).indexOf(req.user.handle);
      discuss.friend.splice(removeIndex, 1);
      discuss.save();
    })
    res.json(discuss.friend);
  })
})



router.delete('/delete', (req,res) => {
  Discuss.findOne({user: req.body.handle})
  .then(discuss => Discuss.findOneAndRemove({user: req.body.handle}));
  res.json("success");
})

const filterUsersByHandle = (obj, data) => {
  let filteredObj = [];
  if(Validator.isEmpty(data)) {
    return obj;
  } else {
    obj.map(item => {
      if(compareString(item.handle, data)) {
        filteredObj = [item, ...filteredObj];
      }
    })
    return filteredObj;
  }
}

const filterUsersByName = (obj, data) => {
  let filteredObj = [];
  if(Validator.isEmpty(data)) {
    return obj;
  } else {
    obj.map(item => {
      if(compareString(item.name, data)) {
        filteredObj = [item, ...filteredObj];
      }
    })
    return filteredObj;
  }
}

const filterUsersByGender = (obj, data) => {
  let filteredObj = [];
  if(Validator.isEmpty(data)) {
    return obj;
  } else {
    obj.map(item => {
      if(item.gender === data) {
        filteredObj = [item, ...filteredObj];
      }
    })
    return filteredObj;
  }
}

const filterUsersByPhone = (obj, data) => {
  let filteredObj = [];
  if(Validator.isEmpty(data)) {
    return obj;
  } else {
    obj.map(item => {
      if(compareString(getPhoneNumber(item.phone_number), getPhoneNumber(data))) {
        filteredObj = [item, ...filteredObj];
      }
    })
    return filteredObj;
  }
}

const getPhoneNumber = (data) => {
  var num = data.split('-');
  var s;
  if(Validator.isEmpty(data)) {
    return "";
  }
  for(var i =0 ; i<num.length;i++) {
    s += num[i];
  }
  return s;
}

const filterUsersByFriend = (data1, data2) => {
  var filtered = [];
  var j = 0;
  if(data1.length === 0) return [];
  if(data2.length === 0) return data1;
  //return filtered;
  
  for(var i = 0; i < data1.length; i++) {
    for(var j = 0; j < data2.length; j++) {
      if(data1[i].handle === data2[j].handle) {
        filtered = [...filtered, data1[i]];
      }
    }
  }
  
  for(var i = 0; i < filtered.length; i++) {
    data1 = data1.filter(item => item.handle !== filtered[i].handle);
  }
  return data1;
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  let temp = __dirname;
  let folderpath = '\\web\\Project\\HySB1\\client\\public';
  const fileDest = path.join(folderpath, `/uploadVoiceEmail/${req.params.handle2}`);
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

router.get('/downloadVoiceEmail/:handle/:file', (req, res) => {
  var folderpath = 'F:/web/Project/HySB1/client/public';
  var path = folderpath +  '/uploadVoiceEmail/' + req.params.handle + '/' + req.params.file;
  fs.exists(path, function(exists) {
    if(exists) {
      res.writeHead(200, {'content-type': 'application/zip'})
      fs.createReadStream(path).pipe(res); // 읽는 차제로 res로 client에 내려보냄.
    } else {
      res.status(400).json({err:'화일이 존재하지 않습니다!'});
    }
  })
})

router.post('/uploadVoiceEmail/:handle1/:handle2/:file', (req, res) => {
   
  var upload = multer({storage: storage}).single('file');
  upload(req, res, (err) => {
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end(__dirname);
    console.log(__dirname.toString(), typeof(__dirname));
  });
    
})


module.exports = router;