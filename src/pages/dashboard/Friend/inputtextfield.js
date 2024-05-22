
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import ModalComponent from '../../../commonUI/components/modal';
import { InputMultipleTextFormWithTitle } from '../../../commonUI/components/inputs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Voice from 'react-native-voice';
import { AudioRecorder } from 'react-native-audio';
import RNFS from 'react-native-fs';
import { ShowToast } from '../../../commonUI/components/elements';

const InputTextField = ({disabled, sendText, uploadMyPhoto, uploadMyVoice, targetUser, ...props}) => {

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


    const [ recordingStatus, setRecordingStatus ] = useState(false);
    const [ isRecord, setIsRecord ] = useState(false);
    const [ time, setTime ] = useState('');

    useEffect(() => {

    })

    const onChangeTextField = (field, value) => {
        setText(value);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    const closePhotoPreviewModal = () => {
        setIsModalPhotoPreview(false);
    }

    const closeRecordVoiceModal = async () => {
        setIsModalRecordVoice(false);
        setIsRecord(false);
        AudioRecorder.onProgress = async (data) => {    
            if( data) {
                await AudioRecorder.stopRecording();
                AudioRecorder.onFinished = (data) => {
                    if(data) {
                        Alert.alert(
                            'Notification', 
                            'Are you sure to upload your voice?', 
                            [
                                {
                                    text: 'Upload',
                                    onPress: () => {
                                        uploadMyVoice( data );
                                    }
                                },
                                {
                                    text: 'Cancel',
                                    style: 'destructive'
                                }
                            ]
                        );  
                    }
                }
            }
        }
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
                            // cropping: true,
                            includeBase64: true,
                            useFrontCamera: true,
                            enableRotationGesture: true,
                            showCropFrame: true,
                            writeTempFile: true,
                            freeStyleCropEnabled: true,
                            cropperCircleOverlay: true
                        }).then(image => {
                            if(image) {
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
        setIsModalRecordVoice(true);
    }

    const startRecord = () => {
        setIsRecord( true );
        let audioPath = RNFS.ExternalStorageDirectoryPath + '/Music/myvoice.aac';
            
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            includeBase64: true,
        });
        AudioRecorder.startRecording();
        AudioRecorder.onProgress = (data) => {    
            var string = "";
            Object.keys(data.currentTime).map(i => string += i + '_');
            setTime(string);
        }
    }

    const stopRecord = async () => {
        closeRecordVoiceModal();
    }

    return (
        <View style = {{flexDirection:'column'}}>
            <ModalComponent 
                isVisible = {isModalVisible} 
                title = "Addition" 
                contentType = "ChatInputAddition" 
                closeModal = {closeModal}
                addPhoto = {addPhoto}
                addVideo = {addVideo}
                addVoice = {addVoice}
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
                status = { isRecord }
                time = { time }
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
                            if(targetUser == "") {
                                ShowToast({type: 'warning', title: 'Please select the friend to chat.'});
                            } else {
                                setIsModalVisible(true);
                            }    
                        }}
                    >    
                    </FIcon.Button>
                </View>
                <View style = {{flex:7}}>
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

export default InputTextField;