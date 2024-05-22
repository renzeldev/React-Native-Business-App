import React, { useState, useEffect, useRef} from 'react';
import {BackHandler, DrawerLayoutAndroid, StyleSheet, View, Text, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
import { ShowToast } from '../../../commonUI/components/elements';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';
import { SERVER_URL, SERVER_IP } from '../../../config';
import { getChatText } from '../../../store/actions/discussActions';
import { getOnlineFriends, defaultChatSetting } from '../../../store/actions/discussActions';
import FriendsOnlineStatus from './Menu';
import io from 'socket.io-client';
import { ProgressBarComponent, ProgressCircleComponent } from '../../../commonUI/components/progress';
import Voice from 'react-native-voice';
import { showMessageModal } from '../../../store/actions/msgActions';
import InputTextField from './inputtextfield';
import ChatTextField from './chattextfield';
// import RNFetchBlob from 'react-native-fetch-blob'
// import FileDownload from 'react-native-file-download';


var curUser;
var socket;
var WS;
var friends;
var flag = false;
var loginMem = new Array();
const MAX_FONT_SIZE = 40;
const MIN_FONT_SIZE = 15;

const ChatRoom = (props) => {

    curUser = props.auth.user.handle;
    friends = props.discuss.friends.filter( item => item.type == 'friend');
    
    const [targetUser, setTargetUser] = useState('');
    const [ fontsize, setFontsize ] = useState(25);
    const [texts, setTexts] = useState({});
    const [newMsg, setNewMsg] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isProgressVisible, setIsProgressVisible] = useState(false);
    const [textShown, setTextShown] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    var backHandler;
    const textRef = useRef();
    // var texts = new Array();
    const [chat, setChat] = useState([]);

    const onSpeechStartHandler = (event) => {
        var string = '';
        Object.keys(event).map(item => string += item + '_');
        Alert.alert('startHandler', string);
    }

    const onSpeechEndHandler = () => {

    }

    const onSpeechResultsHandler = (event) => {
        var string = '';
        Object.keys(event).map(item => string += item + '_');
        Alert.alert('resultHandler', string);
    }

    const getHistoryChat = () => {
        axios.get(SERVER_URL + '/main/chat/gethis')
        .then(res => {
            var textObj = {};
            res.data.map(msg => {
                textObj[msg.handle] = msg.log;
                msg.log.map(item => {
                    props.getChatText(item, msg.handle);
                })   
            })
            // setTexts(props.discuss.chatTextData);
            setTexts(textObj);
        })
    }

    useEffect(
        () => {
            // setTexts({...props.discuss.chatTextData});
            // getHistoryChat();
            
            backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
                goBack()
            });
        
            props.navigation.addListener('willBlur', () => {
                if(backHandler != null) {
                    backHandler.remove();
                }
            })

            Voice.onSpeechStart = onSpeechStartHandler;
            Voice.onSpeechEnd = onSpeechEndHandler;
            Voice.onSpeechResults = onSpeechResultsHandler;

            socket = io(`${SERVER_IP}:8080`, {pfs:null, key:null, passphrase:null, cert:null, ca:null, ciphers:null, rejectUnauthorized: true, forceNode: true});

            socket.on("connect", () => {
                ShowToast({ type: 'success', title: 'Login is succeessful.' , duration: 1000});
                socket.emit('add user', curUser);
                socket.emit('onlinelist', {sender: curUser, receiverList:friends});
                socket.emit('getUncheckMsg', curUser);
            })

            socket.on('getUncheckMsg', (data) => {
                if(data.length != 0) {
                    ShowToast({ type: 'success', title: 'Received new SMS(s)' });
                    var newMsgMem = new Array();
                    data.map(msg => {
                        newMsgMem.push(msg.handle);
                        // setNewMsg(newMsg.concat(msg.handle));
                        setTexts({
                            ...props.discuss.chatTextData,
                            [msg.handle] : props.discuss.chatTextData[msg.handle] ? props.discuss.chatTextData[msg.handle].concat(msg.log) : msg.log
                        })
                        msg.log.map(item => {
                            props.getChatText(item, msg.handle);
                        })
                    });
                    setNewMsg(newMsgMem);
                }   
            })
            socket.on("onlinelist", (data) => {
                loginMem = data.loginMem;
                props.getOnlineFriends(loginMem);
            })
            socket.on("useradd", (data) => {
                if(loginMem.map(mem => mem).indexOf(data) == -1) {
                    ShowToast({ type: 'success', title: data + ' has logged in.'});
                    loginMem.push(data);
                    props.getOnlineFriends(loginMem);
                } 
            })
            socket.on("userout", (data) => {
                if(loginMem.map(mem => mem).indexOf(data) != -1) {
                    ShowToast({ type: 'warning', title: data + ' has logged out.'});
                    loginMem = loginMem.filter(mem => mem != data);
                    props.getOnlineFriends(loginMem);
                }    
            })
            
            socket.on('receivetext', (message) => {
                if(targetUser != message.sender) {
                    setNewMsg(newMsg.concat(message.sender));
                }
                ShowToast({type: 'success', title:`New message from ${message.sender}`, duration:1000});
                message['date'] = String(Date.now());
                setTexts({
                    ...props.discuss.chatTextData,
                    [message.sender] : props.discuss.chatTextData[message.sender] ? props.discuss.chatTextData[message.sender].concat(message) : [message]
                })
                props.getChatText(message, message.sender);
            })
            return () => {

            }
        },
    []);

    const sendText = (text) => {
        if(targetUser == '') {
            ShowToast({type: 'warning', title: 'Please select the friend to chat.'});
        } else {
            var message = {
                sender: curUser,
                receiver: targetUser,
                text: text,
                date: String(Date.now())
            }
            // Alert.alert(message.sender, message.text);
            socket.emit('sendtext', message);
            setTexts({
                ...props.discuss.chatTextData,
                [message.receiver] : props.discuss.chatTextData[message.receiver] ? props.discuss.chatTextData[message.receiver].concat(message) : [message] 
                // [targetUser] : texts[targetUser] ? texts[targetUser].concat(message) : [message]
            })
            props.getChatText(message, targetUser);
            // setTimeout(() => textRef.current.scrollToEnd({animated:true}), 500);
            // ShowMessageModal('sfsdfdsf');
            // props.showMessageModal('sfdfs');
        }
    }

    const goBack = () => {
        if(flag) {
            props.getOnlineFriends([]);
            setTimeout(() => {
                socket.emit('userout', { user:curUser, receiverList:loginMem });
                socket.close();
            }, 500);
            setTexts({});
            props.defaultChatSetting();
            Actions.popTo('friend');
            return true;
        } else {
            ShowToast({type:'other', title: 'Press again to exit.', duration: 1000});
            flag = true;
            setTimeout(() => {
                flag = false;
            }, 3000);
        } 
        
        return false;
    }

    const seeFriendMsg = (handle) => {
        setTargetUser(handle);
        
        if(newMsg.indexOf(handle) != -1) {
            setNewMsg(newMsg.filter(mem => mem != handle));
        }
    }

    const futch = (url, opts, onProgress) => {
        console.log(url, opts)
        return new Promise( (res, rej)=>{
            var xhr = new XMLHttpRequest();
            xhr.open(opts.method, url);
            xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            xhr.setRequestHeader('Authorization', this.props.auth.user.token);
            xhr.onload = e => res(e.target);
            xhr.onerror = rej;
            if (xhr.upload && onProgress)
                xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
            xhr.send(opts.body);
        });
    }

    const uploadBegin = (response) => {
        var jobId = response.jobId;
        console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
      };
      
      const uploadProgress = (response) => {
        var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
        console.log('UPLOAD IS ' + percentage + '% DONE!');
      };

    const uploadPhoto = async (photo) => {
        setProgress(0);
        let formData = new FormData();
        
        // Alert.alert(photo.path);
        let file = {
            // name: photo.path.split('/')[photo.path.split('/').length-1],
            name: curUser + '_' + targetUser + '_' + String(Date.now()) + '.' + photo.mime.split('/')[1],
            type: photo.mime,
            uri: photo.path
            // uri: `data:${photo.mime};base64,${photo.data}`
        }

        // var newfile = new File([`data:${photo.mime};base64,${photo.data}`], file.name, {type: photo.mime});
        await formData.append('file', file);
        setIsProgressVisible(true);
        axios.request({
            method:'post',
            url: SERVER_URL + '/chatupload/' + curUser + '/' + targetUser + '/photo',
            data: formData,
            headers: {
                'Content-Type' :'multipart/form-data',
            },
            onUploadProgress: (p) => {
                console.log(p); 
                setProgress(p.loaded/p.total);
            }
        }).then((res) => {
            // Alert.alert("finish");
            // setProgress(1);
            ShowToast({type:'Success', title: 'Uploading your photo is successful.', duration:2000});
            setIsProgressVisible(false);
            // setProgress(0);
            var message = {
                sender: curUser,
                receiver: targetUser,
                text: file.name,
                // text: photo.path,
                date: String(Date.now()),
                type: 'photo'
            }
            socket.emit('sendtext', message)
            setTexts({
                ...props.discuss.chatTextData,
                [message.receiver] : props.discuss.chatTextData[message.receiver] ? props.discuss.chatTextData[message.receiver].concat(message) : [message] 
            })
            props.getChatText(message, targetUser);
        })
    }

    const uploadVoice = ( voice ) => {
        setProgress(0);

        let formData = new FormData();
        var string = "";
        Object.keys(voice).map(i => string += i + '_');
        // Alert.alert('',voice.base64);

        
        // const filename = voice.audioFileURL
        let file = {
            // name: photo.path.split('/')[photo.path.split('/').length-1],
            name: curUser + '_' + targetUser + '_' + String(Date.now()) + '.aac',
            type: 'audio/aac',
            uri: voice.audioFileURL
            // uri: `data:${photo.mime};base64,${photo.data}`
        }
        formData.append('file', file);

        // var newfile = new File([`data:${photo.mime};base64,${photo.data}`], file.name, {type: photo.mime});
        // formData.append('file', file);
        setIsProgressVisible(true);
        axios.request({
            method:'post',
            url: SERVER_URL + '/chatupload/' + curUser + '/' + targetUser + '/voice',
            data: formData,
            headers: {
                'Content-Type' :'multipart/form-data',
            },
            onUploadProgress: (p) => {
                console.log(p); 
                setProgress(p.loaded/p.total);
            }
        }).then((res) => {
            // Alert.alert("finish");
            setProgress(1);
            ShowToast({type:'Success', title: 'Uploading your voice is successful.', duration:2000});
            setIsProgressVisible(false);
            
            var message = {
                sender: curUser,
                receiver: targetUser,
                text: file.name,
                // text: photo.path,
                date: String(Date.now()),
                type: 'voice'
            }
            socket.emit('sendtext', message)
            setTexts({
                ...props.discuss.chatTextData,
                [message.receiver] : props.discuss.chatTextData[message.receiver] ? props.discuss.chatTextData[message.receiver].concat(message) : [message] 
            })
            props.getChatText(message, targetUser);
        })
    }

    const getFriendHistory = () => {
        if( targetUser ) {
            setRefreshing(true);
            // Alert.alert('sdf');
            axios.get(SERVER_URL + '/main/chat/getFriendHistory/' + targetUser)
            .then(res => {
                res.data.log.map(item => {
                    props.getChatText(item, targetUser);
                })
                // setTexts(props.discuss.chatTextData);
                setTexts({...texts, [targetUser]: res.data.log });
                setRefreshing(false);
            })
        }
        
    }

    const fontSizeBigger = () => {
        if(fontsize != MAX_FONT_SIZE) {
            setFontsize( fontsize + 5 );
        }  
    }

    const fontSizeSmaller = () => {
        if(fontsize != MIN_FONT_SIZE) {
            setFontsize( fontsize - 5 );
        }
    }

    return (
        
        <View style = {{flex:1}}>
            {/* <ProgressBarComponent isVisible = {isProgressVisible} progress = {progress}/>  */}
            <ProgressCircleComponent isVisible = { isProgressVisible } progress = { progress } />
            <DrawerLayoutAndroid
                ref = {drawer => this.drawer = drawer}
                drawerWidth = {300}
                drawerPosition = {DrawerLayoutAndroid.positions.Right}
                renderNavigationView = {
                    () =>   <FriendsOnlineStatus 
                                onPress = {seeFriendMsg} 
                                friends = {friends} 
                                newMsg = {newMsg} 
                                targetUser = {targetUser} 
                                {...props}
                            />
                }
            > 
                <TopBar title = "Chatting Room" onBack={goBack}/>
                <View style = {{margin:10, width:200*em, borderBottomWidth:1}}>
                    <Text style = {{fontSize:25*em}}>
                        To: {targetUser}
                    </Text>
                </View>
                <View style = {{flex:1, flexDirection:'column'}}>
                    <View style = {{flex: 1, borderWidth:1}}>  
                        <ChatTextField chatRef = {textRef} texts = {texts} curUser = {curUser} targetUser = {targetUser} refreshing = {refreshing} getFriendHistory = { getFriendHistory } fontsize = { fontsize } fontSizeBigger = {fontSizeBigger} fontSizeSmaller = {fontSizeSmaller} {...props}  />   
                    </View>
                </View>
                <View style = {{borderWidth:1}}>
                    <InputTextField 
                        uploadMyPhoto = {uploadPhoto}
                        uploadMyVoice = {uploadVoice}
                        sendText = {(text) => {
                            sendText(text);
                        }}
                        targetUser = {targetUser}
                    />
                </View>
            </DrawerLayoutAndroid>
        </View>
        
    )
}

const styles = StyleSheet.create({
    myText: {
        flex:1, 
        // width:400*em, 
        alignSelf:'flex-end', 
        backgroundColor:'#rgba(0,255,0,0.8)', 
        borderRadius:10,
        padding:5,
        margin:10,
        flexDirection:'column',
        fontSize:25*em
    },
    yourText: {
        flex:1, 
        // width:400*em, 
        alignSelf:'flex-start', 
        backgroundColor:'#rgba(255,0,0,0.8)', 
        borderRadius:10,
        padding:5,
        margin:10,
        flexDirection:'column',
        fontSize:25*em
    },
    date: {
        backgroundColor:'#rgba(0,0,0,0.8)',
        marginTop:10,
        padding:2,
        color:'white',
        fontSize:15*em,
        borderRadius:10
    }
})

const mapStateToProps = (state) => ({
    discuss: state.discuss,
    auth: state.auth
})

const mapDispatchToProps = {
    getOnlineFriends: (friends) => getOnlineFriends(friends),
    getChatText: (text, user) => getChatText(text, user),
    defaultChatSetting: () => defaultChatSetting(),
    showMessageModal: (title) => showMessageModal(title)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);