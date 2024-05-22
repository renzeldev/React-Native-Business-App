import React, {Component, useState, useEffect, useRef} from 'react';
import {BackHandler, DrawerLayoutAndroid, StyleSheet, RefreshControl, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
import { TextWithLeftIcon, ShowToast } from '../../../commonUI/components/elements';
import { getArticles, setEboardLoading, countArticles } from '../../../store/actions/eboardAction';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';
import { SERVER_URL, SERVER_IP, SERVER } from '../../../config';
import spinner from '../../../commonUI/image/loading.gif';
import ModalComponent from '../../../commonUI/components/modal';
import Pagination from '../../../commonUI/components/pagination';
import SearchField from '../../../commonUI/components/searchfield';
import isEmpty from '../../../store/validation/is-empty';
import ModalDropdown from 'react-native-modal-dropdown'
import FastImage from 'react-native-fast-image';
import { InputSingleTextFormWithTitle, CheckField, InputMultipleTextFormWithTitle } from '../../../commonUI/components/inputs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setSearchLoading, searchFriends, inviteFriend, getFriends, deleteFriend, cancelRequest, getChatText } from '../../../store/actions/discussActions';
import {getErrors} from '../../../store/actions/errorActions';
import { NormalTextButton } from '../../../commonUI/components/buttons';
import { getOnlineFriends, defaultChatSetting } from '../../../store/actions/discussActions';
import FriendsOnlineStatus from './Menu';
import io from 'socket.io-client';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS, { exists } from 'react-native-fs';
import MsgModel from './MsgModel';
import downloadManager from 'react-native-simple-download-manager';
import { ProgressCircleComponent, ProgressBarComponent } from '../../../commonUI/components/progress';
import Voice from 'react-native-voice';
import { ShowMessageModal } from '../../../commonUI/components/elements';
import { showMessageModal } from '../../../store/actions/msgActions';
// import RNFetchBlob from 'react-native-fetch-blob'
// import FileDownload from 'react-native-file-download';


var curUser;
var socket;
var WS;
var friends;
var flag = false;
var loginMem = new Array();

const ChatRoom = (props) => {

    curUser = props.auth.user.handle;
    friends = props.discuss.friends.filter( item => item.type == 'friend');
    
    const [targetUser, setTargetUser] = useState('');
    const [texts, setTexts] = useState({});
    const [newMsg, setNewMsg] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isProgressVisible, setIsProgressVisible] = useState(false);
    const [textShown, setTextShown] = useState([]);
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
            props.defaultChatSetting();
            getHistoryChat();
            
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
                    data.map(msg => {
                        setNewMsg(newMsg.concat(msg.handle));
                        setTexts({
                            ...props.discuss.chatTextData,
                            [msg.handle] : props.discuss.chatTextData[msg.handle] ? props.discuss.chatTextData[msg.handle].concat(msg.log) : msg.log
                        })
                        msg.log.map(item => {
                            props.getChatText(item, msg.handle);
                        })   
                    })
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
            for (var k in opts.headers||{})
                xhr.setRequestHeader(k, opts.headers[k]);
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

    const uploadPhoto = (photo) => {
        if(targetUser == '') {
            ShowToast({type: 'warning', title: 'Please select the friend to chat.'});
        } else {
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
            formData.append('file', file);
            setIsProgressVisible(true);
            axios.request({
                method:'post',
                url: SERVER_URL + '/chatupload/' + curUser + '/' + targetUser,
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
                ShowToast({type:'Success', title: 'Uploading your photo is successful.', duration:2000});
                setIsProgressVisible(false);
                setProgress(0);
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
    }

    return (
        
        <View style = {{flex:1}}>
            <ProgressBarComponent isVisible = {isProgressVisible} progress = {progress}/> 
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
                        <ChatTextField chatRef = {textRef} texts = {texts} curUser = {curUser} targetUser = {targetUser} {...props} />   
                    </View>
                </View>
                <View style = {{borderWidth:1, positon:'absolute', bottom:0}}>
                    <InputTextField 
                        uploadMyPhoto = {uploadPhoto}
                        sendText = {(text) => {
                            sendText(text);
                        }}
                    />
                </View>
            </DrawerLayoutAndroid>
        </View>
        
    )
}


const PhotoField = ({item, curUser, targetUser, ...props}) => {
    const [flag, setFlag] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isProgressVisible, setIsProgressVisible] = useState(false);
    // const filename = item.text.split('/')[item.text.split('/').length-1];
    const filename = item.text;
    const [progress, setProgress] = useState(0);
    const photoUri = (item.receiver == curUser ? SERVER + '/chatupload/' + targetUser + '_TO_' + curUser + '/' + filename : SERVER + '/chatupload/' + curUser + '_TO_' + targetUser + '/' + filename);
    const URL = (item.receiver == curUser ? SERVER_URL + '/chatdownload/' + targetUser + '/' + curUser + '/' + filename : SERVER_URL + '/chatdownload/' + curUser + '/' + targetUser + '/' + filename);
    
    
    // const DEST = RNFS.PicturesDirectoryPath +'/' + String(Date.now()) + '/' + filename;

    useEffect(() => {
        // RNFS.exists(item.text.replace('file:///', ''))
        RNFS.exists(RNFS.PicturesDirectoryPath + '/' + filename)
        .then(res => {
            setFlag(res);
        })    
    })

    const downloadPhoto = () => {
        // Alert.alert("sdf");
        const DEST = RNFS.PicturesDirectoryPath + '/Downloads';
        const toFileName =  targetUser + '_' + curUser + '_' + String(Date.now()) + '.' + filename.split('.')[1];
        RNFS.mkdir(DEST);
        const headers = {
        // 'Accept-Language': 'en-US'
        }
        RNFS.downloadFile({
            fromUrl: URL,          
            // toFile: DEST +'/' + String(Date.now()) + '_' + filename,    // Local filesystem path to save the file to
            toFile: DEST +'/' + toFileName,
            headers: {'content-type' : 'application/zip'},        // An object of headers to be passed to the server
            background: true,     // Continue the download in the background after the app terminates (iOS only)
            // progressDivider: 10,
            begin: (res) => {
                setIsProgressVisible(true);
            },
            progress: (res) => {
                if(res.totalBytesSent > 0) {
                    setProgress(Math.floor(res.totalBytesSent/res.totalBytesExpectedToSend));
                }    
            },
            connectionTimeout: 10000, // only supported on Android yet
            readTimeout: 10000,  
        }).promise.then(res => {
        
            setFlag(true);
            setIsProgressVisible(false);
            ShowToast({type:'other', title: 'You can check your ' + toFileName + ' file in Downloads folder of picture.', duration:3000})
            // props.showMessageModal('You can check your ' + String(Date.now()) + '_' + filename + ' file in Downloads folder of picture.')
        
            
        }).catch(err => {
            Alert.alert('Whoops', 'Internal Server Error.');
        }) 
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    return (
        <View style = {[item.sender == curUser ? styles.myText: styles.yourText]}>
            <ModalComponent 
                isVisible = {isModalVisible} 
                title = "Photo View" 
                contentType = "PhotoView" 
                // image = {item.text}
                image = {photoUri}
                closeModal = {closeModal}
                // openListModal = {() => {this.setState({isListModalVisible: true})}}
            />
            <ProgressBarComponent isVisible = {isProgressVisible} progress = {progress}/>
            <View style = {{width:300*em, height:400*em}}>
                { curUser == item.receiver ? (
                    <TouchableOpacity onPress = {() => setIsModalVisible(true)}>
                        {/* <Image source = {{ uri: 'http://192.168.1.254:5000/chatupload/khs0101/HS981014_ad9fddd0-6cdf-4ba1-a752-7a6563f83c4c.jpg' }} style = {{width:'100%', height:'100%', resizeMode:'contain'}} /> */}
                        <Image source = {{ uri: photoUri }} style = {{width:'100%', height:'100%', resizeMode:'contain'}} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress = {() => setIsModalVisible(true)}>
                        <Image source = {{ uri: photoUri }} style = {{width:'100%', height:'100%', resizeMode:'contain'}} />
                    </TouchableOpacity>
                ) }
                
                
                {/* { flag ? (
                    <TouchableOpacity onPress = {() => setIsModalVisible(true)}>
                        <Image source = {{ uri: item.text }} style = {{width:'100%', height:'100%', resizeMode:'contain'}} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress = {downloadPhoto}>
                        <View style = {{alignItems:'center'}}>
                            <Text style = {{textAlign:'center', justifyContent:'center'}}>
                                Click here to download image.
                            </Text>
                        </View>
                    </TouchableOpacity>
                )} */}
            </View>
            <TouchableOpacity onPress = {downloadPhoto}>
                <View style = {{alignItems:'center'}}>
                    <Text style = {{textAlign:'center', justifyContent:'center', color:'white'}}>
                        Click here to download.<MIcon name = 'cloud-download' size = {25*em} color = "white"/>
                    </Text>
                </View>
            </TouchableOpacity>
            <Text style = {styles.date}>
                {new Date(Number(item.date)).toLocaleString()}
            </Text>
        </View>
    )
}

const ChatTextField = ({chatRef, texts, curUser, targetUser, ...props}) => {

    // const [text, setText] = useState('');
    const _renderItem = ({item, index}) => {
        if(item.sender == targetUser || item.receiver == targetUser) {
            switch(item.type) {
                case 'photo':
                    return (
                        <PhotoField item = {item} curUser = {curUser} targetUser = {targetUser}/>
                    )
                case 'video':
                    return (
                        <View>

                        </View>
                    )
                case 'voice':
                    return (
                        <View>

                        </View>
                    )
                default:
                    return (
                        <View style = {item.sender == curUser ? styles.myText: styles.yourText}>
                            <Text style = {{color: 'white'}}>
                                {item.text}
                            </Text>
                            <Text style = {styles.date}>
                                {new Date(Number(item.date)).toLocaleString()}
                            </Text>
                        </View>
                    )
            }
            
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imgUri, setImgUri] = useState('');

    // const textRef = useRef();

    const scrollToEnd = () => {
        chatRef.current.scrollToEnd({animated: true});
    }

    return (
        <View style = {{flex: 1, margin:10, borderWidth:2, borderColor:"#ccc", borderRadius:10}}>
            <ScrollView 
                ref  = {chatRef}  
                onContentSizeChange={scrollToEnd} 
            >
                <FlatList 
                    // data = {props.discuss.chatTextData[targetUser] ? props.discuss.chatTextData[targetUser] : []}
                    
                    data = {texts[targetUser]}
                    keyExtractor = {(item => item.date)}
                    renderItem = {_renderItem}
                    vertical = {true}
                />
            </ScrollView>
        </View>
    )
}

const EmoticSymbol = ({}) => {
    return (
        <View style = {{flexDirection:'row', padding:5, backgroundColor:'rgba(0,0,0,0.5)'}}>
            <View style = {{marginRight: 15}}>
                <TouchableOpacity>
                    <FIcon name = 'fonticons' size = {30*em} color = 'yellow'>        
                    </FIcon>
                </TouchableOpacity>
            </View>
            <View style = {{marginRight: 15}}>
                <TouchableOpacity>
                    <MIcon name = 'emoticon' size = {30*em} color = 'yellow'>        
                    </MIcon>
                </TouchableOpacity>
            </View>
            <View style = {{marginRight: 15}} >
                <TouchableOpacity>
                    <Icon name = 'face' size = {30*em} color = 'yellow'>        
                    </Icon>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const InputTextField = ({disabled, sendText, uploadMyPhoto, ...props}) => {

    const [todoState, setTodoState] = useState({
		name:'',
		handle:'',
		gender:'',
		birthday:'',
		phone_number:'',
		isMale: true,
        isFemale: true,
        
    });
    const [text, setText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalPhotoPreview, setIsModalPhotoPreview] = useState(false);
    const [isModalRecordVoice, setIsModalRecordVoice] = useState(false);
    const [myphoto, setMyPhoto] = useState({});

    const onChangeTextField = (field, value) => {
        setText(value);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    const closePhotoPreviewModal = () => {
        setIsModalPhotoPreview(false);
    }

    const closeRecordVoiceModal = () => {
        setIsModalRecordVoice(false);
    }

    const cancelUploadPhoto = () => {
        setIsModalPhotoPreview(false);
        setMyPhoto({});
        ImagePicker.clean();
    }

    const uploadPhoto = () => {
        uploadMyPhoto(myphoto);
        setIsModalPhotoPreview(false);
        setMyPhoto({});
        ImagePicker.clean();
    }

    const addPhoto = () => {
        setIsModalVisible(false);
        Alert.alert(
            'Selection', 
            'Please choose to get image.', 
            [
                {
                    text: 'Take photo',
                    onPress: () => {
                        ImagePicker.openCamera({
                            width: 300,
                            height: 400,
                            cropping: true,
                            useFrontCamera: true,
                            includeBase64: true,
                            writeTempFile: true,
                            freeStyleCropEnabled: true,
                            enableRotationGesture: true,
                        }).then(image => {
                            if(image) {
                                
                                setMyPhoto(image);
                                setIsModalPhotoPreview(true);
                                // this.setState({ image: image});
                                // this.props.setImage(image);
                                // this.setState({isModalVisible:false});
                            }		
                        }).catch(err => {
                            return false;
                        });
                    }
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        ImagePicker.openPicker({
                            // width: 300,
                            // height: 400,
                            cropping: true,
                            includeBase64: true,
                            useFrontCamera: true,
                            enableRotationGesture: true,
                            showCropFrame: true,
                            writeTempFile: true,
                            freeStyleCropEnabled: true,
                            cropperCircleOverlay: true
                        }).then(image => {
                            if(image) {
                                // var string = '';
                                // Object.keys(image).map(t => string += t + '_');
                                // Alert.alert(string, image.path);
                                // Alert.alert(image.mime);
                                setMyPhoto(image);
                                setIsModalPhotoPreview(true);
                                // this.setState({image:image});
                                // this.props.setImage(image);
                                // this.setState({isModalVisible:false});
                            }
                        }).catch(err => {
                            return false;
                        });
                    }
                }
            ]
        );
        
    }

    const addVideo = () => {
        setIsModalVisible(false);
        Alert.alert(
            'Selection', 
            'Please choose to get video.', 
            [
                {
                    text: 'Record',
                    onPress: () => {
                        ImagePicker.openCamera({
                            useFrontCamera: true,
                            includeBase64: true,
                            mediaType:'video',
                            writeTempFile: true,
                        }).then(image => {
                            if(image) {
                                var string = '';
                                Object.keys(image).map(i => string += i + '_');
                                Alert.alert(string);
                                // this.setState({ image: image});
                                // this.props.setImage(image);
                                // this.setState({isModalVisible:false});
                            }		
                        }).catch(err => {
                            return false;
                        });
                    }
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        ImagePicker.openPicker({
                            includeBase64: true,
                            useFrontCamera: true,
                            mediaType: 'video',
                            writeTempFile: true,
                        }).then(video => {
                            if(video) {
                                var string = '';
                                Object.keys(image).map(i => string += i + '_');
                                Alert.alert(string);
                                // this.setState({image:image});
                                // this.props.setImage(image);
                                // this.setState({isModalVisible:false});
                            }
                        }).catch(err => {
                            var string = '';
                                Object.keys(image).map(i => string += i + '_');
                                Alert.alert(string);
                            return false;
                        });
                    }
                }
            ]
        );
    }

    const addVoice = () => {
        setIsModalVisible(false);
        Alert.alert(
            'Selection', 
            'Please choose to get voice.', 
            [
                {
                    text: 'Record',
                    onPress: () => {
                        setIsModalRecordVoice(true);
                    }
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        ImagePicker.openPicker({
                            includeBase64: true,
                            useFrontCamera: true,
                            mediaType: 'video'
                        }).then(video => {
                            if(video) {
                                var string = '';
                                Object.keys(image).map(i => string += i + '_');
                                Alert.alert(string);
                                // this.setState({image:image});
                                // this.props.setImage(image);
                                // this.setState({isModalVisible:false});
                            }
                        }).catch(err => {
                            return false;
                        });
                    }
                }
            ]
        );
    }

    const takePhoto = () => {
        ImagePicker.openCamera({
			width: 300,
			height: 400,
			cropping: true,
			useFrontCamera: true,
			includeBase64: true
		}).then(image => {
			if(image) {
				// this.setState({ image: image});
				// this.props.setImage(image);
				// this.setState({isModalVisible:false});
			}		
		}).catch(err => {
			return false;
		});
    }

    const takeVideo = () => {
        ImagePicker.openCamera({
			useFrontCamera: true,
            includeBase64: true,
            mediaType: "video",
		}).then(image => {
			if(image) {
				// this.setState({ image: image});
				// this.props.setImage(image);
				// this.setState({isModalVisible:false});
			}		
		}).catch(err => {
			return false;
		});
    }

    const recordVoice = () => {

    }

    const startRecord = () => {
        // Voice.startSpeech();
        Voice.start('en-US');
    }

    const stopRecord = () => {
        Voice.stop();
    }

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

    // useEffect(() => {
    //     Voice.onSpeechStart = onSpeechStartHandler;
    //     Voice.onSpeechEnd = onSpeechEndHandler;
    //     Voice.onSpeechResults = onSpeechResultsHandler;
    // })

    // const textRef = useRef();
    return (
        <View style = {{flexDirection:'column'}}>
            <ModalComponent 
                isVisible = {isModalVisible} 
                title = "Addition" 
                contentType = "ChatInputAddition" 
                closeModal = {closeModal}
                addPhoto = {addPhoto}
                takePhoto = {takePhoto}
                addVideo = {addVideo}
                takeVideo = {takeVideo}
                addVoice = {addVoice}
                recordVoice = {recordVoice}
                // openListModal = {() => {this.setState({isListModalVisible: true})}}
            />
            <ModalComponent 
                isVisible = {isModalPhotoPreview} 
                title = "Image Preview" 
                contentType = "PhotoPreview" 
                closeModal = {closePhotoPreviewModal}
                uploadPhoto = {uploadPhoto}
                cancelUploadPhoto = {cancelUploadPhoto}
                image = {myphoto}
                // openListModal = {() => {this.setState({isListModalVisible: true})}}
            />
            <ModalComponent 
                isVisible = {isModalRecordVoice} 
                title = "Record your voice." 
                contentType = "RecordVoice" 
                closeModal = {closeRecordVoiceModal}
                startRecord = {startRecord}
                stopRecord = {stopRecord}
                // image = {myphoto}
                // openListModal = {() => {this.setState({isListModalVisible: true})}}
            />
            <EmoticSymbol />
            <View style = {{padding:10, flexDirection:'row'}}>
                <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <FIcon.Button 
                        name = 'plus' 
                        color = "#006688" 
                        size = {25} 
                        backgroundColor = 'transparent' 
                        onPress = {() => {
                            setIsModalVisible(true);
                        }}
                    >    
                    </FIcon.Button>
                </View>
                <View style = {{flex:7}}>
                    
                    
                    {/* <View style = {{flex:1, borderWidth:1, borderRadius:10, }}>
                        <TouchableOpacity onPress = {() => {
                            // var string = '';
                            // Object.keys(textRef.current.props).map(item => string += item + '_');
                            // Alert.alert("sdf", string);
                            textRef.current.props.autoFocus = true;
                        // this.refs.textfield.click();
                        }}>
                            <Text style = {{padding:5}}>
                                {text}
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                    <InputMultipleTextFormWithTitle 
                        style = {{flex:1, height:'auto'}}
                        placeholder = "Type here."
                        placeholderTextColor = "grey"
                        onChangeText = {onChangeTextField}
                        autoFocus = {true}
                        fontColor = "black"
                        field = "text"
                        value = {text}
                        disabled = {disabled}    
                    />
                    
                    {/* <TextInput ref = {textRef} style = {{display: 'none'}} onChangeText = {onChangeTextField} value = {text} autoFocus = {true}/> */}
                </View>
                <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <FIcon.Button 
                        name = 'arrow-right' 
                        color = "#006688" 
                        size = {25} 
                        backgroundColor = 'transparent' 
                        onPress = {() => {
                            sendText(text);
                            setText('');
                        }}>    
                    </FIcon.Button>
                </View>
            </View>
        </View>
    )
}

// class InputTextField extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             text:''
//         }
//     }



//     onChangeTextField (field, value) {
//         this.setState({text:value});
//     }

//     render() {
//         return (
//             <View style = {{flexDirection:'column'}}>
//                 <EmoticSymbol />
//                 <View style = {{padding:10, flexDirection:'row'}}>
//                     <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
//                         <FIcon.Button name = 'plus' color = "#006688" size = {25} backgroundColor = 'transparent' >    
//                         </FIcon.Button>
//                     </View>
//                     <View style = {{flex:7}}>
                        
                        
//                         <View style = {{flex:1, borderWidth:1, borderRadius:10, minHeight:50*em}}>
//                             <TouchableOpacity onPress = {() => {
//                                 // var string = '';
//                                 // Object.keys(this.refs).map(item => string += item + '_');
//                                 // Alert.alert("sdf", string);
//                                 this.refs.text.focus();
//                                 // textRef.current.props.autoFocus = true;
//                             // this.refs.textfield.click();
//                             }}>
//                                 <Text style = {{padding:5}}>
//                                     {this.state.text}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                         {/* <InputMultipleTextFormWithTitle 
//                             ref = "text"
//                             style = {{flex:1, height:'auto', display:'none'}}
//                             placeholder = "Type here."
//                             placeholderTextColor = "grey"
//                             onChangeText = {this.onChangeTextField.bind(thisTypeAnnotation)}
//                             autoFocus = {true}
//                             fontColor = "black"
//                             field = "text"
//                             value = {this.state.text}
//                             disabled = {this.props.disabled}    
//                         /> */}
                        
//                         <TextInput value = {this.state.text} ref = "text" onChangeText = {this.onChangeTextField.bind(this)}/>
//                     </View>
//                     <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
//                         <FIcon.Button name = 'arrow-right' color = "#006688" size = {25} backgroundColor = 'transparent' onPress = {() => {this.props.sendText(text)}}>    
//                         </FIcon.Button>
//                     </View>
//                 </View>
//             </View>
//         )
//     }
    
// }

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