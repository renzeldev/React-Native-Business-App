import React, {Component} from 'react';
import { StyleSheet, PanResponder, View, Text, Dimensions, Alert, Share, TextInput} from 'react-native';
// import { RNCamera } from 'react-native-camera';
import {RNCamera} from 'react-native-camera';
// import FileDownload from 'react-native-file-download';
// import fs from 'react-native-fs';
import { SERVER_URL } from '../../../config';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import RNFS from 'react-native-fs';
// import {Icon} from 'react-native-icons';
// import {Camera, Permissions} from 'expo';
import downloadManager from "react-native-simple-download-manager";
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
const myIcon = (<Icon name="rocket" size={30} color="#900" />)
const myIcon1 = (<Icon name="headphones" size={30} color="#900" />)
const myIcon2= (<Icon name="volume-off" size={30} color="#900" />)
const myIcon3 = (<Icon name="volume-down" size={30} color="#900" />)
const myIcon4 = (<Icon name="qrcode" size={30} color="#900" />)
const myIcon5 = (<Icon name="barcode" size={30} color="#900" />)

const myMIcon1 = (<MIcon name="access-alarm" size={30} color="#900" />)
const myMIcon2= (<MIcon name="access-alarms" size={30} color="#900" />)
const myMIcon3 = (<MIcon name="access-time" size={30} color="#900" />)
const myMIcon4 = (<MIcon name="accessibility" size={30} color="#900" />)
const myMIcon5 = (<MIcon name="accessible" size={30} color="#900" />)

const myButton = (
    <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={() => {
        Share.share({
            message:'fsdfsdfsdf',
            title: 'QR code'
        })
        .then(res => {
            var string = '';
            Object.keys(res).map(i => string += i + '_');
            Alert.alert(string);
        })
    }}>
      Login with Facebook
    </Icon.Button>
  );

// import RNFetchBlob from 'react-native-fetch-blob';

const url = SERVER_URL + '/api/users/wasan/download/';
// const headers = { Authorization: "Bearer abcsdsjkdjskjdkskjd" };
const config = {
  downloadTitle: "Title that should appear in Native Download manager",
  downloadDescription:
    "Description that should appear in Native Download manager",
  saveAsName: "wasan.zip",
  allowedInRoaming: true,
  allowedInMetered: true,
  showInDownloads: true,
  external: false, //when false basically means use the default Download path (version ^1.3)
  path: "Download/" //if "external" is true then use this path (version ^1.3)
};

var CIRCLE_SIZE = 40;
var CIRCLE_COLOR = 'blue';
var CIRCLE_HIGHLIGHT_COLOR = 'green';

class News extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
    }
    
    constructor(props) {
        super(props);
        this._panResponder = {};
        this._previousLeft = 0;
        this._previousTop = 0;
        this._circleStyles = {};
        this.circle = null;
        this.state = {
            numberActiveTouches: 0,
            moveX: 0,
            moveY: 0,
            x0: 0,
            y0: 0,
            dx: 0,
            dy: 0,
            vx: 0,
            vy: 0,
            percent: 0,
            downloadId:'',
            is_recording: false,
            audio: '',
            count_up : 0,
        }
    }

    componentWillMount () {
        this.setState({ is_recording: true })
        // Alert.alert(AudioUtils.DocumentDirectoryPath);
        
        let audioPath = RNFS.ExternalStorageDirectoryPath + '/Music/test.aac';

        this.audio = AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac"
        });

        AudioRecorder.startRecording();

        this.setState({ audio: audioPath })
        
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._highlight,
            onPanResponderMove: (e, gestureState) => {
                this.setState({
                    stateID: gestureState.stateID,
                    moveX: gestureState.moveX,
                    moveY: gestureState.moveY,
                    x0: gestureState.x0,
                    y0: gestureState.y0,
                    dx: gestureState.dx,
                    dy: gestureState.dy,
                    vx: gestureState.vx,
                    vy: gestureState.vy,
                    numberActiveTouches: gestureState.numberActiveTouches
                });
                // Calculate current position using deltas
                this._circleStyles.left = this._previousLeft + gestureState.dx;
                this._circleStyles.top = this._previousTop + gestureState.dy;
                // this._circleStyles.left = this._previousLeft
                // this._circleStyles.top = this._previousTop
                this._updatePosition();
            },
            onPanResponderRelease: (e, gestureState) => {
                this._unHighlight();
                this._circleStyles.left = this._previousLeft;
                this._circleStyles.top = this._previousTop;
                // this.circle.setNativeProps(this._circleStyles);
                this._updatePosition();
                // this._previousLeft += gestureState.dx;
                // this._previousTop += gestureState.dy;
            },
            onPanResponderTerminate: (e, gestureState) => {
                this._unHighlight();
                // this._previousLeft += gestureState.dx;
                // this._previousTop += gestureState.dy;
            },
        });
        this._previousLeft = 20;
        this._previousTop = 184;
        this._circleStyles = {
            left: this._previousLeft,
            top: this._previousTop,
            zIndex: 999,
        };
    }
    componentDidMount() {
        this._updatePosition();
        

        // this.interval = setInterval(() => this.setState(prev => ({ count_up: prev.count_up.add(1, 'second') })), 1000)    
        // RNFetchBlob
        // .config({
        //     fileCache: true,
        //     path : RNFetchBlob.fs.dirs.DocumentDir + '/Download',
        //     // useDownloadManager: true,
        //     // title: 'Downloading...',
        //     // description: 'File Download'
        //     // addAndroidDownloads : {
        //     //     useDownloadManager : true,
        //     //     title : 'awesome.zip',
        //     //     description : 'An APK that will be installed',
        //     //     mime : 'application/zip',
        //     //     mediaScannable : true,
        //     //     notification : true,
        //     //   }
        // })
        // .fetch('GET', url, {
        // //... some headers,
        // 'Content-Type' : 'application/zip',
        // // 'Content-Type' : 'octet-stream'
        // })
        // .progress({ count : 10 }, (received, total) => {
        //     // console.log('progress', received / total)
        //     this.setState({percent: String(received / total)});
        // })
        // .then((resp) => {
        // // ...
        //     var string = "";
        //     Object.keys(resp).map(item => string += item + "_");

        //     Alert.alert('File Download.', string);
        // })
        // .catch((err) => {
        // // ...
        // })

        // downloadManager
        // .queueDownload((url), (headers = {}), (config))
        // .then(response => {
        //     downloadManager.checkStatus(downloadId = response)
        //     .then(res => {
        //         var string = "";
        //         Object.keys(res).map(item => string += item + "_")
        //         // Alert.alert("sdf", string);
        //         this.setState({percent: this.state.percent + res.status});
        //     })
        //     // this.setState({percent: response});
        //     // var string = "";
        //     // Object.keys(response).map(item => string += item + "_")
        //     // Alert.alert("sdf", response);
        //     this.setState({downloadId: response});
        //     // this.setState({percent: response.reason});
            
        //     // Alert.alert("File Downloaded.", response.reason);
        // })
        // .catch(err => {
        //     console.log("Download failed!");
        // });

        // downloadManager.attachOnCompleteListener(downloadId = this.state.downloadId)
        // .then(res => {
        //     var string = "";
        //     Object.keys(res).map(item => string += item + "_")
        //     Alert.alert("sdf", string);
        // })

        
        
        // FileDownload.addListener(SERVER_URL + '/api/users/wasan/download/', (info) => {
        //     // console.log(`complete ${(info.totalBytesWritten / info.totalBytesExpectedToWrite * 100)}%`);
        //     this.setState({percent: `${(info.totalBytesWritten / info.totalBytesExpectedToWrite * 100)}%`});
        //   });
        // FileDownload.download(SERVER_URL + '/api/users/wasan/download/', 'Download/', 'wasan.zip', {'Accept-Language' : 'en-US'})
        // .then((response) => {
        //     // console.log(`downloaded! file saved to: ${response}`)
        //     Alert.alert("File Downloaded.");

        // })
        // .catch((error) => {
        //     // console.log(error)
        // })
    }

    clear_time = () => {

        this.setState({ is_recording: false, count_up: moment().minute(0).second(0) })

        // clearInterval(this.interval)
    }

    send = async () => {

        await AudioRecorder.stopRecording();

        this.setState({ is_recording: false })

        AudioRecorder.onFinished = async (data) => {

            let fd = new FormData();

            await fd.append('file', data.audioFileURL)

        // let sound = await Api.post('api/chats/upload-vc', fd)

        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    ref={(circle) => {
                    this.circle = circle;
                    }}
                    style={styles.circle}
                    {...this._panResponder.panHandlers}/>
                <Text>
                    {this.state.numberActiveTouches} touches,
                    dx: {this.state.dx},
                    dy: {this.state.dy},
                    vx: {this.state.vx},
                    vy: {this.state.vy},
                    movex: {this.state.moveX},
                    movey: {this.state.moveY},
                    state: {this.state.percent}
                </Text>
                    {myIcon}
                    {myIcon1}
                    {myIcon2}
                    {myIcon3}
                    {myIcon4}
                    {myIcon5}
                    {myMIcon1}
                    {myMIcon2}
                    {myMIcon3}
                    {myMIcon4}
                    {myMIcon5}

                    {myButton}
                    <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={() => {
                        this.send();
                    }}>
                    Record
                    </Icon.Button>

                    <IIcon.ToolbarAndroid
                        title="Home"
                        titleColor="white"
                        navIconName="md-arrow-back"
                        onIconClicked={() => {}}
                        actions={[
                            { title: 'Settings', iconName: 'md-settings', iconSize: 30, show: 'always' },
                            { title: 'Follow me on Twitter', iconName: 'logo-twitter', iconColor: "#4099FF", show: 'ifRoom' },
                        ]}
                        overflowIconName="md-more"
                    />
                    <Text style = {{fontSize:30}}>Lorem <IIcon name="ios-book" color="#4F8EF7" size = {30} /> Ipsum</Text>
            </View>
        )
    }
    takePicture() {
        this.camera.capture()
          .then((data) => console.log(data))
          .catch(err => console.error(err));
    }

    _highlight() {
        this.circle && this.circle.setNativeProps({
            backgroundColor: CIRCLE_HIGHLIGHT_COLOR
        });
    }
    _unHighlight() {
        this.circle && this.circle.setNativeProps({
            backgroundColor: CIRCLE_COLOR
        });
    }
        // We're controlling the circle's position directly with setNativeProps.
    _updatePosition() {
        this.circle && this.circle.setNativeProps(this._circleStyles);
    }
    _handleStartShouldSetPanResponder(e, gestureState) {
        // Should we become active when the user presses down on the circle?
        return true;
    }
    _handleMoveShouldSetPanResponder(e, gestureState){
        // Should we become active when the user moves a touch over the circle?
        return true;
    }
    _handlePanResponderGrant(e, gestureState) {
        this._highlight();
    }
    _handlePanResponderMove(e, gestureState) {
        this.setState({
            stateID: gestureState.stateID,
            moveX: gestureState.moveX,
            moveY: gestureState.moveY,
            x0: gestureState.x0,
            y0: gestureState.y0,
            dx: gestureState.dx,
            dy: gestureState.dy,
            vx: gestureState.vx,
            vy: gestureState.vy,
            numberActiveTouches: gestureState.numberActiveTouches
        });
        // Calculate current position using deltas
        this._circleStyles.left = this._previousLeft + gestureState.dx;
        this._circleStyles.top = this._previousTop + gestureState.dy;
        this._circleStyles.zIndex = 999;
        this._updatePosition();
    }
    _handlePanResponderEnd(e, gestureState) {
        this._unHighlight();
        this._previousLeft += gestureState.dx;
        this._previousTop += gestureState.dy;
    }
}

var styles = StyleSheet.create({
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: CIRCLE_COLOR,
        position: 'absolute',
        left: 0,
        top: 0,
},
// container: {
//     flex: 1,
//     paddingTop: 64,
//     },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      preview: {
       flex: 1,
       justifyContent: 'flex-end',
       alignItems: 'center',
       height: Dimensions.get('window').height,
       width: Dimensions.get('window').width
     },
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
      }
})

export default News;


