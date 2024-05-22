const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const isEmpty = require('../../validation/is-empty');
const User = require('../../models/User');
const Discuss = require('../../models/Discuss');
const StateMessage = require('../../models/StateMessage');
const Chat = require('../../models/Chat');

router.post('/saveLog', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    if(chat) {
      const newLog = {
        date: Date.now(),
        handle: req.body.handle,
        log: req.body.log
      }
      chat.messageLog.unshift(newLog);
      chat.save();
      res.send("리력을 정확히 보존하였습니다.");
    } else {
      const newChat = new Chat({
        user: req.user.handle,
        messageLog: {
          date:Date.now(),
          handle: req.body.handle,
          log:req.body.log
        }
      })
      newChat.save();
      res.send("리력을 정확히 보존하였습니다.");
    }
  })
})

router.get('/loadLog', passport.authenticate('jwt', {session:false}),(req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    if(chat) {
      res.json(chat.messageLog);
    } else {
      res.json([]);
    }
    
  })
})

router.get('/loadUserLog/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    if(chat) {
      const userMessageLog = chat.messageLog.filter(item => 
        item.handle === req.params.handle
      )
      res.json(userMessageLog);
    }
  })
  .catch(err => res.json(err));
})

router.post('/delUserLog/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    if(chat) {
      const count = chat.messageLog.filter(item => 
        item.handle === req.params.handle
      ).length
      for(var i = 0 ;i < count; i ++) {
        const removeIndex = chat.messageLog.map(item => item.handle.toString()).indexOf(req.params.handle);
        chat.messageLog.splice(removeIndex, 1);
      }
      chat.save();
    }
    res.json("조작이 성공하였습니다.")
  })
})

router.post('/saveMeetingLog', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    if(chat) {
      const newMtLog = {
        date: Date.now(),
        log: req.body
      }
      chat.meetingLog.unshift(newMtLog);
      chat.save();
      res.send("회의기록을 정확히 보존하였습니다.");
    } else {
      const newChat = new Chat({
        user: req.user.handle,
        meetingLog: {
          date:Date.now(),
          log:req.body
        }
      })
      newChat.save();
      res.send("회의기록을 정확히 보존하였습니다.");
    }
  })
})

router.get('/loadMeetingLog', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user:req.user.handle})
  .then(chat => {
    if(chat) {
      res.json(chat.meetingLog)
    } else {
      res.json([]);
    }
  })
})

router.get('/user/:id', (req, res) => {
  Chat.findOne({user:req.params.id})
  .then(chat => {
    res.json(chat);
  })
})

router.post('/keepAllSendingEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    req.body.receiverList.map(item => {
      const data = {
        handle: item.handle,
        text: req.body.text,
        file: req.body.file,
      }
      chat.ToEmail.unshift(data);
      chat.save();
      StateMessage.findOne({user: item.handle})
      .then(item => {
        if(item) {
          const message = {
            message: req.user.handle + "동지가 전자우편을 보내왔습니다."
          }
          item.stateMessage.unshift(message);
          item.save();
        } else {
          const newItem = new StateMessage({
            user: item.handle,
            stateMessage: {
              message: req.user.handle + "동지가 전자우편을 보내왔습니다.",
              date: Date.now(),
            }
          });
          newItem.save();
        } 
      })
      // StateMessage.findOne({user: item.handle})
      // .then(stm => {
      //   const newMsg = {
      //     message: req.user.handle + "동지가 전자우편을 보내왔습니다."
      //   }
      //   stm.stateMessage.unshift(newMsg);
      //   stm.save();
      // })
   })
  })
  res.json("조작성공");
})

router.post('/keepAllNonReadEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  req.body.offlineMem.map(user => (
    Chat.findOne({user: user})
    .then(chat => {
      const data = {
        handle: req.user.handle,
        text: req.body.msg.text,
        file: req.body.msg.file,
      }
      chat.NonReadEmail.unshift(data);
      chat.save();
    })
  ))
  res.json("조작성공");
})

router.post('/keepNonReadEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.body.receiver})
  .then(chat => {
    const newNonReadEmail = {
      handle: req.body.sender,
      text: req.body.msg.text,
      file: req.body.msg.file,
      emailType: req.body.msg.emailType
    }
    chat.NonReadEmail.unshift(newNonReadEmail);
    chat.save();
    // StateMessage.findOne({user: req.body.receiver})
    // .then(stm => {
    //   const newMsg = {
    //     message: req.body.sender + "동지가 전자우편을 보내왔습니다."
    //   }
    //   stm.stateMessage.unshift(newMsg);
    //   stm.save();
    // })
    StateMessage.findOne({user: req.body.receiver})
    .then(item => {
      if(item) {
        const message = {
          message:req.body.msg.emailType == 'audio'? req.body.sender + "동지가 음성우편을 보내왔습니다.": req.body.sender + "동지가 전자우편을 보내왔습니다."
        }
        item.stateMessage.unshift(message);
        item.save();
      } else {
        const newItem = new StateMessage({
          user: req.body.receiver,
          stateMessage: {
            message: req.body.msg.emailType == 'audio'? req.body.sender + "동지가 음성우편을 보내왔습니다.":req.body.sender + "동지가 전자우편을 보내왔습니다.",
            date: Date.now(),
          }
        });
        newItem.save();
      } 
    })
  })
  Chat.findOne({user: req.body.sender})
  .then(chat => {
    const sendingEmail = {
      handle: req.body.receiver,
      text: req.body.msg.text,
      file: req.body.msg.file,
      emailType: req.body.msg.emailType
    }
    chat.ToEmail.unshift(sendingEmail);
    chat.save();
  })
  res.json("조작성공");
})

router.post('/keepSendingEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.body.sender})
  .then(chat => {
    const sendingEmail = {
      handle: req.body.receiver,
      text: req.body.msg.text,
      file: req.body.msg.file,
      emailType: req.body.msg.emailType
    }
    chat.ToEmail.unshift(sendingEmail);
    // StateMessage.findOne({user: req.body.receiver})
    // .then(stm => {
    //   const newMsg = {
    //     message: req.body.sender + "동지가 전자우편을 보내왔습니다."
    //   }
    //   stm.stateMessage.unshift(newMsg);
    //   stm.save();
    // })
    StateMessage.findOne({user: req.body.receiver})
      .then(item => {
        if(item) {
          const message = {
            message: req.body.msg.emailType == 'audio'? req.body.sender + "동지가 음성우편을 보내왔습니다.":req.body.sender + "동지가 전자우편을 보내왔습니다."
          }
          item.stateMessage.unshift(message);
          item.save();
        } else {
          const newItem = new StateMessage({
            user: req.body.receiver,
            stateMessage: {
              message: req.body.msg.emailType == 'audio'? req.body.sender + "동지가 음성우편을 보내왔습니다.": req.body.sender + "동지가 전자우편을 보내왔습니다.",
              date: Date.now(),
            }
          });
          newItem.save();
        } 
    })
    chat.save().then(chat => res.json(sendingEmail));
  })
})

router.post('/keepReceivingEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.body.receiver})
  .then(chat => {
    const receivingEmail = {
      handle: req.body.sender,
      text: req.body.msg.text,
      file: req.body.msg.file,
      emailType: req.body.msg.emailType
    }
    chat.FromEmail.unshift(receivingEmail);
    chat.save().then(chat => res.json(receivingEmail));
  })
})
router.get('/getNonReadEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    res.json(chat.NonReadEmail);
    //chat.save().then(chat => res.json(receivingEmail));
  })
})


router.post('/keepNonToReceivingEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    const data = {
      handle: req.body.handle,
      text: req.body.text,
      file: req.body.file,
      date: req.body.date,
      emailType: req.body.emailType
    }
    //res.json(data);
    chat.FromEmail.unshift(data);
    const removeIndex = chat.NonReadEmail.map(item => item._id.toString()).indexOf(req.body._id);
    chat.NonReadEmail.splice(removeIndex,1);
    chat.save();
    res.json(chat.NonReadEmail);
  })
})

router.post('/keepAllNewMsgsToReceivingEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    for(var i = req.body.length; i >= 0; i --) {
      const data = {
        handle: req.body[i-1].handle,
        text: req.body[i-1].text,
        file: req.body[i-1].file,
        date: req.body[i-1].date,
        emailType: req.body[i-1].emailType,
      }
      chat.FromEmail.unshift(data);
      const removeIndex = chat.NonReadEmail.map(msg => msg._id.toString()).indexOf(req.body[i-1]._id);
      chat.NonReadEmail.splice(removeIndex, 1);
      chat.save();
    }
  })
  res.json([]);
})

router.post('/receiveNonReadEmail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    const data = {
      handle: req.body.sender,
      text: req.body.msg.text,
      file: req.body.msg.file,
      emailType: req.body.msg.emailType
    }
    chat.NonReadEmail.unshift(data);
    chat.save();
    res.json(chat.NonReadEmail);
  })
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  let temp = __dirname;
  //temp = temp.replace('BackEnd', '');
  
//   const fileDest = 'F:/upload/';
//   console.log('temp',temp, fileDest);
  const fileDest = path.join(__dirname, '/chatUpload/');
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
  cb(null, req.user.handle + "_" + file.originalname)
      // if(ext === undefined) {
      //     cb(null, name + '_' + Date.now())
      // } else {
      //     cb(null, name + ext)
      // }
  }
})

router.post('/upload/:file', passport.authenticate('jwt', {session:false}),(req, res) => {
   
  var upload = multer({storage: storage}).single('file');
  upload(req, res, (err) => {
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end(__dirname);
  })
})

router.get('/gethis', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    // console.log('onlinelist ', data.sender, onlineUser, chat.messageLog);
    if(chat) {
      console.log(chat.messageLog);
      res.json(chat.messageLog);
    } else {
      res.json([]);
    }
    // ns.connected[id].emit('onlinelist', {loginMem:onlineUser, allMsg: chat.messageLog});
  })
})

router.get('/getFriendHistory/:friend', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    // console.log('onlinelist ', data.sender, onlineUser, chat.messageLog);
    if(chat) {
      console.log(chat.messageLog.filter( item => item.handle == req.params.friend ));
      res.json(...chat.messageLog.filter( item => item.handle == req.params.friend ));
    } else {
      res.json([]);
    }
    // ns.connected[id].emit('onlinelist', {loginMem:onlineUser, allMsg: chat.messageLog});
  })
})

router.get('/download/:file', (req, res) => {
  var path = __dirname +  '/chatUpload/' + req.params.file;
  fs.exists(path, function(exists) {
    if(exists) {
      res.writeHead(200, {'content-type': 'application/zip'})
			fs.createReadStream(path).pipe(res); // 읽는 차제로 res로 client에 내려보냄.
    } else {
      res.status(400).json({err:'화일이 존재하지 않습니다!'});
    }
  })
})

router.get('/getSendEmail/:number', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    var data = [];
    var number = req.params.number;
    if(chat.ToEmail.length === 0) {
      res.json([]);
    }
    for(var i = 10*(number-1); i < 10*number ; i++ ) {
       data = [...data, chat.ToEmail[i]];
       if(i === chat.ToEmail.length-1) break;
     }
    res.json(data);
  })
})

router.get('/getReceiveEmail/:number', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    var data = [];
    var number = req.params.number;
    if(chat.FromEmail.length === 0) {
      res.json([]);
    }
    for(var i = 10*(number-1); i < 10*number ; i++ ) {
      
       data = [...data, chat.FromEmail[i]];
       if(i === chat.FromEmail.length-1) break;
     }
    res.json(data);
  })
})

router.get('/countEmails', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    var numOfToEmails = chat.ToEmail.length;
    var numOfFromEmails = chat.FromEmail.length;
    //res.json("sss");
    res.json({ToNumber:numOfToEmails, FromNumber:numOfFromEmails });
  })
})


router.get('/getUserSendEmail/:number/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    const filtered = chat.ToEmail.filter(item => item.handle === req.params.handle);
    var data = [];
    var number = req.params.number;
    if(filtered.length === 0) {
      res.json([]);
    }
    for(var i = 10*(number-1); i < 10*number ; i++ ) {
       data = [...data, filtered[i]];
       if(i === filtered.length-1) break;
     }
    res.json(data);
  })
})

router.get('/getUserReceiveEmail/:number/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    const filtered = chat.FromEmail.filter(item => item.handle === req.params.handle);
    var data = [];
    var number = req.params.number;
    if(filtered.length === 0) {
      res.json([]);
    }
    for(var i = 10*(number-1); i < 10*number ; i++ ) {
      
       data = [...data, filtered[i]];
       if(i === filtered.length-1) break;
     }
    res.json(data);
  })
})

router.get('/countUserEmails/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    var numOfToEmails = chat.ToEmail.filter(item => item.handle === req.params.handle).length;
    var numOfFromEmails = chat.FromEmail.filter(item => item.handle === req.params.handle).length;
    //res.json("sss");
    res.json({ToNumber:numOfToEmails, FromNumber:numOfFromEmails });
  })
})

router.delete('/delEmail/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Chat.findOne({user: req.user.handle})
  .then(chat => {
    var removeIndex = chat.ToEmail.map(item => item._id.toString()).indexOf(req.params.id);
    if(removeIndex !== -1) {
      chat.ToEmail.splice(removeIndex, 1);
      chat.save();
      res.json(req.params.id)
    } else {
      var removeIndex1 = chat.FromEmail.map(item => item._id.toString()).indexOf(req.params.id);
      chat.FromEmail.splice(removeIndex1,1);
      chat.save();
      res.json(req.params.id);
    }
  })
})

router.delete('/:id', (req, res) => {
  Chat.findOne({user: req.params.id})
  .then(chat => Chat.findOneAndRemove({user:req.params.id}));
  res.json("success");
})
module.exports = router;