const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bson = require('bson');
const users = require('./routes/api/users');
const quesandans = require('./routes/main/quesandans');
const eboard = require('./routes/main/eboard');
const notification = require('./routes/main/notification');
const discuss = require('./routes/main/discuss');
const passport = require('passport');
const chat = require('./routes/main/chat');
const keys = require('./config/keys');
const config = require('./config/main');
const stateMessage = require('./routes/main/stateMessage');
const task = require('./routes/task/task');
const fs=require('fs');
const fileUpload = require('express-fileupload');
const UploadFile = require('./models/FileUpload');
const User = require('./models/User');
const Chat = require('./models/Chat');
const multer = require('multer');


var numUsers = 0;
var loginUsers = new Array();
var friendlist = new Array();



const app = express();
app.use((req, res, next) => {
	
  let origin = req.headers.origin;
  console.log(origin);
  if(config.allowed_origin.indexOf(origin) >= 0) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// app.use(bson.MAXSIZE:50*1024*1024);

// app.use(fileUpload({
//   limits: {fileSize: 50 * 1024 * 1024 * 1024}
// }));


const db = 'mongodb://localhost:27017/db';

mongoose.connect(db)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.post('/upload', passport.authenticate('jwt', {session:false}), (req, res) => {
  console.log("file", req.files, 'sdfdf', req);
  if(req.user.handle =='admin') {
    const newUploadFile = new UploadFile ({
      user: req.user.handle,
      file: req.files.file
    })
    newUploadFile.save().then(UploadFile => {res.json("올리적재가 완료되였습니다.")})
  } else {
    User.findOne({handle: req.user.handle})
    .then(user => {
      if(user) {
        var ws = fs.createWriteStream(__dirname + '/chatupload/1');
        ws.write(req.files.file.data);
        ws.end();
      }
    })
    .catch(err => {
      err.nouser = '해당한 사용자를 찾을수 없습니다'.
      res.status(404).json(err);
    });
  }
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  let temp = __dirname;
  const folderpath = '\\web\\Project\\HySB1\\client\\public';
  //temp = temp.replace('BackEnd', '');
  
//   const fileDest = 'F:/upload/';
//   console.log('temp',temp, fileDest);
  // const fileDest = path.join(__dirname, '/chatupload/' + req.params.targetUser);
  const fileDest = path.join(folderpath, '/chatupload/' + req.params.type + '/' + req.params.curUser + '_TO_' + req.params.targetUser);
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

app.post('/chatupload/:curUser/:targetUser/:type', passport.authenticate('jwt', {session:false}), (req, res) => {
   
  var upload = multer({storage: storage}).single('file');
  upload(req, res, (err) => {
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end(__dirname);
  })
})


app.get('/tests', (req, res) => {
  res.json(__dirname);
})

app.get('/chatdownload/:type/:user1/:user2/:filename', (req, res) => {
  console.log("sdfdfdf");
  const folderpath = '\\web\\Project\\HySB1\\client\\public';
  // var path = __dirname + '/chatupload/' + req.params.user1 + '/' + req.params.user2 + '_' + req.params.filename;
  var path = folderpath + '/chatupload/'+ req.params.type + '/' + req.params.user1 + '_TO_' + req.params.user2 + '/' + req.params.filename;
  fs.exists(path, function(exists) {
    if(exists) {
      res.writeHead(200, {'content-type':'application/zip'});
      fs.createReadStream(path).pipe(res);
    } else {
      return res.status(404).json({err:"File not found."});
    }
  })
})

app.get('/download/:id', (req, res) => {
  UploadFile.findById(req.params.id)
  .then(item => {
    fs.createStream(item.file.data).pipe(res);
  })
})

const chatServer = require('http').Server(app);
const io = require('socket.io')(chatServer);
io.on('connection', (socket) => {
  var addedUser = false;
  socket.on('add user', (username) => {

    console.log('add user ', username, addedUser, loginUsers);
    if(addedUser) return;
    var flag = true;
    loginUsers.map(user => {
      if(user === username) {
        flag = false;
        return;
      }
    })
    if(flag){
      
      socket.username = username;
      // socket.headers = ('agent', 'perMessageDeflate', 'pfs','key', 'passphrase', 'cert', 'caciphers', 'rejectUnauthorized')
      socket.action = false,
      loginUsers.push(username);
      ++numUsers;
      addedUser = true;
      console.log('flag is true', loginUsers);
      // socket.broadcast.emit('useradded', loginUsers);
      // socket.emit('useradded', loginUsers);
    }
  })
  socket.on('onlinelist', (data) => {

    var ns = io.of('/');
    var onlineUser = [];
    friendlist = data.receiverList;
    if(ns) {
      Object.keys(ns.connected).map(id => {
        for(var i = 0; i < data.receiverList.length; i++) {
          if(ns.connected[id].username === data.receiverList[i].handle) {
            onlineUser = [...onlineUser, ns.connected[id].username];
            console.log('useradd', ns.connected[id].username, data.sender)
            ns.connected[id].emit('useradd', data.sender);
          }
        }
      })
    }
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].emit('onlinelist', {loginMem:onlineUser});
        }
      })
    }
  })

  socket.on('sendtext', (data) => {
    var ns = io.of('/');
    var flag = false;
    console.log(data);
    Chat.findOne({user: data.sender})
    .then(chat => {
      if(chat) {
        const index = chat.messageLog.map( msg => msg.handle).indexOf(data.receiver);
        if(index == -1) {
          chat.messageLog.push({handle:data.receiver, log:[data]});
        } else {
          chat.messageLog[index].log.push(data);
        }  
        chat.save();
      } else {
        const newsenderchat = new Chat({
          user:data.sender,
          uncheckmessageLog:[],
          messageLog:[
            {
              handle: data.receiver,
              log:[data]
            }
          ]
        })
        newsenderchat.save();
      }
    });
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username == data.receiver) {
          flag = true;
          ns.connected[id].emit('receivetext', data);
          Chat.findOne({user: data.receiver})
          .then(chat1 => {
            if(chat1) {
              const index = chat1.messageLog.map( msg => msg.handle).indexOf(data.sender);
              if(index == -1) {
                chat1.messageLog.push({handle:data.sender, log:[data]});
              } else {
                chat1.messageLog[index].log.push(data);
              }  
              chat1.save();
            } else {
              const newreceiverchat = new Chat({
                user:data.receiver,
                messageLog:[
                  {
                    handle: data.sender,
                    log:[data]
                  }
                ],
                uncheckmessageLog:[],
              })
              newreceiverchat.save();
            }
          });
        }
      })
      if(!flag) {
        Chat.findOne({user: data.receiver})
        .then(chat1 => {
          if(chat1) {
            const index = chat1.uncheckmessageLog.map( msg => msg.handle).indexOf(data.sender);
            if(index == -1) {
              chat1.uncheckmessageLog.push({handle:data.sender, log:[data]});
            } else {
              chat1.uncheckmessageLog[index].log.push(data);
            }  
            chat1.save();
          } else {
            const newreceiverchat = new Chat({
              user:data.receiver,
              messageLog:[],
              uncheckmessageLog:[
                {
                  handle: data.sender,
                  log:[data]
                }
              ]
            })
            newreceiverchat.save();
          }
        });
      }
    }
  })

  socket.on('getUncheckMsg', (user) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username == user) {
          Chat.findOne({user:user})
          .then(chat => {
            if(chat) {
              ns.connected[id].emit('getUncheckMsg', chat.uncheckmessageLog);
              chat.uncheckmessageLog.map(unmsg => {
                var index = chat.messageLog.map(msg => msg.handle).indexOf(unmsg.handle);
                if(index == -1) {
                  chat.messageLog.push({handle: unmsg.handle, log:unmsg.log});
                } else {
                  chat.messageLog[index].log = chat.messageLog[index].log.concat(unmsg.log);
                }
              })
              chat.uncheckmessageLog = [];
              chat.save();
            } else {
              ns.connected[id].emit('getUncheckMsg', []);
            }
          })
        }
      })
    }
  })

  socket.on('userout', (data) => {
    // console.log(data);
    var ns = io.of('/');
    loginUsers = loginUsers.filter(mem => mem != data.user);
    console.log(data, loginUsers);
    if(ns) {
      Object.keys(ns.connected).map(id => {
        for(var i = 0; i < data.receiverList.length; i++) {
          if(ns.connected[id].username === data.receiverList[i]) {
            //onlineUser = [...onlineUser, ns.connected[id].username];
            console.log(ns.connected[id].username);
            ns.connected[id].emit('userout', data.user);
          }
        }
      })
    }
  })
  socket.on('disconnect', () => {
    // addedUser = false;
    console.log('disconnected');
    var ns = io.of('/');
    var flag = false;
    for(var user in loginUsers) {
      flag = false;
      Object.keys(ns.connected).map(id => {
        if(user == ns.connected[id].username) {
          flag = true;
        }
      })
      if(!flag) {
        loginUsers = loginUsers.filter(mem => mem != user);
      }
    }
  })
  socket.on('inviteToChatPage', (data) => {
    var ns = io.of('/');
    var isIn = false;
    var thisSocket;
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          //ns.connected[id].emit('curUserBusy', {});
          thisSocket = ns.connected[id];
        }
      })
    }
    if(thisSocket.action) {
      thisSocket.emit('curUserBusy', {});
    }
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          if(ns.connected[id].action) {
            Object.keys(ns.connected).map(id => {
              if(ns.connected[id].username === data.sender) {
                ns.connected[id].emit('friendBusy', data.receiver);
              }
            }) 
          } else {
            ns.connected[id].emit('inviteToChatPage', data);
            ns.connected[id].action = true;
            thisSocket.action = true;
          } 
          isIn = true;
        }
      })
      if(!isIn) {
        Object.keys(ns.connected).map(id => {
          if(ns.connected[id].username === data.sender) {
            ns.connected[id].emit('friendNotConnected', data.receiver);
          }
        })
      }
    }
  })
  socket.on('accept', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('accept', data);
          //ns.connected[id].action = true;
        }
        if(ns.connected[id].username === data.sender) {
          //ns.connected[id].action = true;
        }
      })
    }
  })
  socket.on('refuse', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('refuse', data);
          ns.connected[id].action = false;
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = false;
        }
      })
    }
  })
  socket.on('sendMessage', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('sendMessage', data);
        }
      })
    }
  })
  socket.on('exitChatPage', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('exitChatPage', data);
          ns.connected[id].action = false;
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = false;
        }
      })
    }
  })
  socket.on('inviteToMeeting', (data) => {
    var ns = io.of('/');
    var busylist = "";
    var flag = true;
    //var thisSocket;
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender && ns.connected[id].action) {
          //thisSocket = ns.connected[id];
          ns.connected[id].emit('curUserBusy', {});
          flag = false;
        }
        if(ns.connected[id].username === data.sender && data.receiverList.length === 0) {
          ns.connected[id].emit("cantOpenMeeting", {});
          flag = false;
        }
      })
    }
    if(flag) {
      if(ns) {
        //thisSocket.action = true;  
        Object.keys(ns.connected).map(id => {
          if(ns.connected[id].username === data.sender) {
            ns.connected[id].action = true;
          }
        })
        Object.keys(ns.connected).map(id => {
          for(var i = 0; i < data.receiverList.length; i++) {
            if(ns.connected[id].username === data.receiverList[i]) {
              //onlineUser = [...onlineUser, ns.connected[id].username];
              if(ns.connected[id].action) {
                busylist += data.receiverList[i] + " ";
              } else {
                ns.connected[id].emit('inviteToMeeting', data.sender);
                ns.connected[id].action  = true;
              } 
            }
          }
        })
      }
      if(ns) {
        Object.keys(ns.connected).map(id => {
          if(ns.connected[id].username === data.sender) {
            setTimeout(() => {
              ns.connected[id].emit('endInvitingToMeeting', {});
            }, 500)
            if(busylist.length === data.receiverList.length) {
              ns.connected[id].emit('cantOpenMeeting', {});
              ns.connected[id].action = false;
            } else {
              //ns.connected[id].action = true;
              if(busylist.length !== 0){
                setTimeout(() => {
                  ns.connected[id].emit('friendBusy', busylist);
                }, 500)
              }
            }
          }
        })
      }
    }

  })
  
  socket.on('acceptMeeting', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('acceptMeeting', data);      
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = true;
        }
      })
    }
  })

  socket.on('refuseMeeting', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('refuseMeeting', data);      
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = false;
        }
      })
    }
  })
  socket.on('sendMeetingMessageToClient', (data) => {
    var ns = io.of('/');
    
    if(ns) {
      Object.keys(ns.connected).map(id => {
        for(var i = 0; i < data.receiverList.length; i++) {
          if(ns.connected[id].username === data.receiverList[i]) {
            //onlineUser = [...onlineUser, ns.connected[id].username];
            ns.connected[id].emit('getMeetingMessageFromServer', data.message);
          }
        }
      })
    }
  })
  socket.on('sendMeetingMessageToServer', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('getMeetingMessageFromClient', data);  
        }
      })
    }
  })
  socket.on('quitMeeting', (data) => {
    var ns = io.of('/');
    
    if(ns) {
      Object.keys(ns.connected).map(id => {
        for(var i = 0; i < data.receiverList.length; i++) {
          if(ns.connected[id].username === data.receiverList[i]) {
            //onlineUser = [...onlineUser, ns.connected[id].username];
            ns.connected[id].emit('quitMeeting', data.sender);
            ns.connected[id].action = false;
          }
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = false;
        }
      })
    }
  })
  socket.on('exitMeeting', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('exitMeeting', data);      
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = false;
        }
      })
    }
  })
  socket.on('inviteToVideoCall', (data) => {
    var ns = io.of('/');
    var isIn = false;
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender && ns.connected[id].action) {
          ns.connected[id].emit('curUserBusy', {});
        }
      })
    }
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          if(ns.connected[id].action) {
            Object.keys(ns.connected).map(id => {
              if(ns.connected[id].username === data.sender) {
                ns.connected[id].emit('friendBusy', data.receiver);
              }
            })
          } else {
            ns.connected[id].emit('inviteToVideoCall', data);
          }
          isIn = true;
        }
      })
    }
    if(!isIn) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].emit('friendNotConnected', data.receiver);
        }
      })
    }
  })
  socket.on('acceptVideoCall', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('acceptVideoCall', data);
          ns.connected[id].action = true;
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = true
        }
      })
    }
  })
  socket.on('sendEmail', (data) => {
    var ns = io.of('/');
    var flag = false;
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('sendEmail', data);
          flag = true;
        }
      })
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          if(!flag) {
            ns.connected[id].emit('cantsendEmail', data);
          } else {
            ns.connected[id].emit('alreadysendEmail', data);
          }
        }
      })
    }
  }) 
  socket.on('sendEmailToAll', (data) => {
    var ns = io.of('/');
    var offlineMem = [];
    if(ns) { 
      for(var i = 0; i< data.receiverList.length; i++) {
        var flag = false;
        var msgData = {sender: data.sender, receiver: data.receiverList[i].handle, msg: data.msg}
        Object.keys(ns.connected).map(id => {
          if(ns.connected[id].username === data.receiverList[i].handle) {
            flag = true;
            ns.connected[id].emit('sendEmail', msgData);
            console.log('sendEmailToAll', data.receiverList[i] );
          }
        })
        if(!flag) {
          Object.keys(ns.connected).map(id => {
            if(ns.connected[id].username === data.sender) {
              // setTimeout(() => {
              //   ns.connected[id].emit('cantsendEmailToAll', msgData)  
              // }, 100);
              
              offlineMem = [...offlineMem, data.receiverList[i].handle ];
              console.log('sendEmailToAll', data.receiverList[i] );
            }
          })
        }
      } 
    }
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          setTimeout(() => {
            ns.connected[id].emit('endSendEmailToAll', {offlineMem: offlineMem, msg:data.msg});
          }, 1000)
        }
      })
    }
  })

  socket.on('inviteToVoiceCall', (data) => {
    var ns = io.of('/');
    var isIn = false;
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender && ns.connected[id].action) {
          ns.connected[id].emit('curUserBusy', {});
        }
      })
    }
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          if(ns.connected[id].action) {
            Object.keys(ns.connected).map(id => {
              if(ns.connected[id].username === data.sender) {
                ns.connected[id].emit('friendBusy', data.receiver);
              }
            })
          } else {
            ns.connected[id].emit('inviteToVoiceCall', data);
          }
          isIn = true;
        }
      })
    }
    if(!isIn) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].emit('friendNotConnected', data.receiver);
        }
      })
    }
  })
  socket.on('acceptVoiceCall', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('acceptVoiceCall', data);
          ns.connected[id].action = true;
        }
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].action = true
        }
      })
    }
  })
  socket.on('offer', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('offer', data);
        }
      })
    }
  })
  socket.on('candidate', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('candidate', data);
        }
      })
    }
  })
  socket.on('answer', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('answer', data);
        }
      })
    }
  })

  socket.on('mediaStream', (data) => {
    var ns = io.of('/');
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.receiver) {
          ns.connected[id].emit('mediaStream', data);
        }
      })
    }
  })
  console.log("Chat Server Connected.");
  
})
//////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port:920});
// var userss = {}
// wss.on('connection', (connection) => {
  
//   connection.on('close', (code, reason) => {
//     delete userss[reason];
//     loginUsers = loginUsers.filter(mem => mem != reason);
//     // console.log(reason);
//     // console.log('close', userss.HS981014);
//     // if (connection.name) {
//     //   delete userss[connection.name];
      
//     //   loginUsers = loginUsers.filter(mem => mem != connection.name);
//     //   console.log(userss, loginUsers);
//     // }
//   })
//   connection.on('message', (message) => {
//     var data;
//     try {
//       data = JSON.parse(message);
//       console.log(data);
//     }
//     catch(e) {
//       console.log("Error parsing JSON");
//       data = {}
//     }
//     switch(data.type) {
//       case "login":
//         {
//           if(loginUsers.indexOf(data.name) == -1) {
//             loginUsers.push(data.name);
//             connection.name = data.name;
//             userss[data.name] = connection;
//           }
//           console.log(connection.name + " logged.");
//           var array = new Array();
//           data.list.map(mem => {
//             if(loginUsers.indexOf(mem.handle) != -1) {
//               array.push(mem.handle);
//             }
//           })
//           connection.send(JSON.stringify({
//             type:'onlinelist',
//             list: array
//           }))
//         }

//       case "sendtext":
//         {

//           if(userss[data.toUser]) {
//             userss[data.toUser].send(JSON.stringify({
//               type:'receivetext',
//               text: data.text,
//               fromUser: data.fromUser
//             }))
//           }
          
//           console.log(data.text);
//         }
//       case "close":
//         {
//           delete userss[data.name];
//           loginUsers = loginUsers.filter(mem => mem != connection.name);
//         }
//       // case 'onlinelist':
//       //   {
//       //     // console.log(data);
//       //     var array = [];
//       //     data.list.map(mem => {
//       //       if(loginUsers.indexOf(mem.handle) != -1) {
//       //         array.push(mem.handle);
//       //       }
//       //     })
//       //     console.log(array);
//       //     connection.send(JSON.stringify({
//       //       type:'onlinelist',
//       //       list: array
//       //     }))
//       //   }
//       default:
//         connection.send(JSON.stringify({
//           type:'error',
//           message: 'Internel server error.'
//         }))
//     }
//   })
// })

// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port:920});
// var userss = {};
// wss.on('connection', (connection) => {
//   connection.on('message', (message) => {
//     var data;
//     try {
//       data = JSON.parse(message);
//     }
//     catch(e) {
//       console.log("Error parsing JSON");
//       data = {};
//     }
//     switch(data.type) {
//       case "login":
//         console.log("User logged in as ", data.name);
//         if(userss[data.name]) {
//           sendTo(connection, {
//             type: "login",
//             success: false
//           });
//         } else {
//           userss[data.name] = connection;
//           connection.name = data.name;
//           sendTo(connection, {
//             type: "login",
//             success: true,
//           })
//         }
//       case "offer":
// 			console.log("Sending offer to", data.name);
// 			var conn = userss[data.name];
// 			if (conn != null) {
// 				connection.otherName = data.name;
// 				sendTo(conn, {
// 					type: "offer",
// 					offer: data.offer,
// 					name: connection.name
// 				});
// 			}
// 			case "answer":
// 			console.log("Sending answer to", data.name);
// 			var conn = userss[data.name];
// 			if (conn != null) {
// 				connection.otherName = data.name;
// 				sendTo(conn, {
// 					type: "answer",
// 					answer: data.answer
// 				});
// 			}
// 			case "allows":
// 				console.log("allow to", data.name);
// 			    var conn = userss[data.name];
// 			    if (conn != null) {
// 					console.log("아아ㅏ");
// 				sendTo(conn, {
// 					type: "allow",
// 					mes:""
// 				});
// 			}
// 			case "candidate":
// 			console.log("Sending candidate to", data.name);
// 			var conn = userss[data.name];
// 			if (conn != null) {
// 				sendTo(conn, {
// 					type: "candidate",
// 					candidate: data.candidate
// 				});
// 			}
//       default:
//         sendTo(connection, {
//           type: "error",
//           message: "Unrecognized command: " + data.type + "content->" + data.name,
//         })
//     }
//   })
//   connection.on('close', function () {
//     if (connection.name) {
//       delete userss[connection.name];
//       if (connection.otherName) {
//         console.log("Disconnecting user from",
//         connection.otherName);
//         var conn = userss[connection.otherName];
//         // conn.otherName = null;
//         if (conn != null) {
//         console.log("send to other")
  
//           // sendTo(conn, {
//           // type: "leave"
//           // });
//         }
//       }
//     }
//   });
// })

// function sendTo(connection, message) {
//   connection.send(JSON.stringify(message));
// }

// wss.on('listening', () => {
//   console.log('Web Socket Server started.')
// })

console.log("chatServer created at 8080");

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({limit:'50mb'}));
app.use(passport.initialize());
require('./config/passport')(passport); 
app.use('/api/users', users);
app.use('/main/quesandans', quesandans);
app.use('/main/eboard', eboard);
app.use('/main/notification', notification);
app.use('/main/discuss', discuss);
app.use('/main/chat', chat);
app.use('/main/stateMessage', stateMessage);
app.use('/task/task', task);

chatServer.listen(8080);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

// const mainServer=https.createServer({
//   key:fs.readFileSync(path.resolve(__dirname,"../crt/key.pem")),
//   crt:fs.readFileSync(path.resolve(__dirname,"../crt/cert.pem"))
// },app);

// mainServer.listen(port, () => console.log(`Server running on port ${port}`));
