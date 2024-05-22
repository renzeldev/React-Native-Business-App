const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
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
const https = require('https');
const fs=require('fs')
var numUsers = 0;
var loginUsers = new Array();
var friendlist = new Array();


const app = express();
app.use((req, res, next) => {
	
  let origin = req.headers.origin;
  // console.log(origin);
  if(config.allowed_origin.indexOf(origin) >= 0) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
const db = 'mongodb://localhost:27017/db';

mongoose.connect(db)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const chatServer = require('http').Server(app);
const io = require('socket.io')(chatServer);
io.on('connection', (socket) => {
  var addedUser = false;
  socket.on('add user', (username) => {
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
      socket.action = false,
      loginUsers.push(username);
      ++numUsers;
      addedUser = true;
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
            ns.connected[id].emit('useradd', data.sender);
          }
        }
      })
    }
    if(ns) {
      Object.keys(ns.connected).map(id => {
        if(ns.connected[id].username === data.sender) {
          ns.connected[id].emit('onlinelist', onlineUser);
        }
      })
    }
  })
  socket.on('userout', (data) => {
    console.log(data);
    var ns = io.of('/');
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
    
    if(addedUser) {
      numUsers--;
      var disconnectedUser;
      loginUsers.map(user => {
        if(user === socket.username) {
          disconnectedUser = user;
        }
      })
      loginUsers = loginUsers.filter(user => user !== disconnectedUser);
    }
    var ns = io.of('/');
      if(ns) {
        //console.log("useroutttt", Object.keys(ns.connected).length)
        Object.keys(ns.connected).map(id => {
          for(var i = 0; i < friendlist.length; i++) {
            console.log("userouttt", ns.connected[id].username, friendlist[i].handle)
            if(ns.connected[id].username === friendlist[i].handle) {
              //onlineUser = [...onlineUser, ns.connected[id].username];
              console.log("userout", ns.connected[id].username,  socket.username);
              ns.connected[id].emit('userout', socket.username);
            }
          }
        })
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

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port:920});
var userss = {};
wss.on('connection', (connection) => {
  connection.on('message', (message) => {
    var data;
    try {
      data = JSON.parse(message);
    }
    catch(e) {
      console.log("Error parsing JSON");
      data = {};
    }
    switch(data.type) {
      case "login":
        console.log("User logged in as ", data.name);
        if(userss[data.name]) {
          sendTo(connection, {
            type: "login",
            success: false
          });
        } else {
          userss[data.name] = connection;
          connection.name = data.name;
          sendTo(connection, {
            type: "login",
            success: true,
          })
        }
      case "offer":
			console.log("Sending offer to", data.name);
			var conn = userss[data.name];
			if (conn != null) {
				connection.otherName = data.name;
				sendTo(conn, {
					type: "offer",
					offer: data.offer,
					name: connection.name
				});
			}
			case "answer":
			console.log("Sending answer to", data.name);
			var conn = userss[data.name];
			if (conn != null) {
				connection.otherName = data.name;
				sendTo(conn, {
					type: "answer",
					answer: data.answer
				});
			}
			case "allows":
				console.log("allow to", data.name);
			    var conn = userss[data.name];
			    if (conn != null) {
					console.log("아아ㅏ");
				sendTo(conn, {
					type: "allow",
					mes:""
				});
			}
			case "candidate":
			console.log("Sending candidate to", data.name);
			var conn = userss[data.name];
			if (conn != null) {
				sendTo(conn, {
					type: "candidate",
					candidate: data.candidate
				});
			}
      default:
        sendTo(connection, {
          type: "error",
          message: "Unrecognized command: " + data.type + "content->" + data.name,
        })
    }
  })
  connection.on('close', function () {
    if (connection.name) {
      delete userss[connection.name];
      if (connection.otherName) {
        console.log("Disconnecting user from",
        connection.otherName);
        var conn = userss[connection.otherName];
        // conn.otherName = null;
        if (conn != null) {
        console.log("send to other")
  
          // sendTo(conn, {
          // type: "leave"
          // });
        }
      }
    }
  });
})

function sendTo(connection, message) {
  connection.send(JSON.stringify(message));
}

wss.on('listening', () => {
  console.log('Web Socket Server started.')
})

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

// app.listen(port, () => console.log(`Server running on port ${port}`));

const mainServer=https.createServer({
  key:fs.readFileSync(path.resolve(__dirname,"../crt/key.pem")),
  crt:fs.readFileSync(path.resolve(__dirname,"../crt/cert.pem"))
},app);

mainServer.listen(port, () => console.log(`Server running on port ${port}`));
