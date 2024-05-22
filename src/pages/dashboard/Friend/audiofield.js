
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import { ShowToast } from '../../../commonUI/components/elements';
import { SERVER_URL, SERVER } from '../../../config';
import ModalComponent from '../../../commonUI/components/modal';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS, { exists } from 'react-native-fs';
import { ProgressBarComponent } from '../../../commonUI/components/progress';


const AudioField = ({item, curUser, targetUser, ...props}) => {
    const [isProgressVisible, setIsProgressVisible] = useState(false);
    // const filename = item.text.split('/')[item.text.split('/').length-1];
    const filename = item.text;
    const [progress, setProgress] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const DEST = RNFS.ExternalStorageDirectoryPath + '/Music/Voice/Downloads';
    const audioUri = (item.receiver == curUser ? SERVER + '/chatupload/voice/' + targetUser + '_TO_' + curUser + '/' + filename : SERVER + '/chatupload/voice/' + curUser + '_TO_' + targetUser + '/' + filename);
    const filepath = DEST + '/' + item.text;
    const URL = (item.receiver == curUser ? SERVER_URL + '/chatdownload/voice/' + targetUser + '/' + curUser + '/' + filename : SERVER_URL + '/chatdownload/voice/' + curUser + '/' + targetUser + '/' + filename);
    useEffect(() => {

    })

    const downloadAudio = () => {

        setProgress(0);
        RNFS.mkdir(DEST);
        const headers = {
        // 'Accept-Language': 'en-US'
        }
        RNFS.downloadFile({
            fromUrl: URL,          
            // toFile: DEST +'/' + String(Date.now()) + '_' + filename,    // Local filesystem path to save the file to
            toFile: filepath,
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
            setProgress(1);
            setIsProgressVisible(false);
            ShowToast({
                type:'other', 
                title: 'You can check your ' + item.text + ' file in Downloads folder of music.', 
                // title: 'Click once again to hear.',
                duration:3000
            });        
            
        }).catch(err => {
            Alert.alert('Whoops', 'Internal Server Error.');
        }) 
    }

    const playAudio = () => {
        // const DEST = RNFS.ExternalStorageDirectoryPath + '/Music/Voice/Downloads/' + item.text;
        // RNFS.exists(DEST)
        // .then( res => {
        //     if( !res ) {
        //         downloadAudio();
        //     } else {
        //         setIsModalVisible(true);
        //     }  
        // })
        setIsModalVisible(true);
    }


    const closeModal = () => {
        setIsModalVisible(false);
    }

    return (
        <View style = {[item.sender == curUser ? styles.myStyle: styles.yourStyle, styles.text]}>
            <ProgressBarComponent isVisible = {isProgressVisible} progress = {progress}/>
            <ModalComponent 
                isVisible = {isModalVisible} 
                title = "Audio Player" 
                contentType = "AudioModal" 
                // image = {item.text}
                path = {audioUri}
                closeModal = {closeModal}
            />
            <View style = {{flexDirection:'row'}}>
                <TouchableOpacity onPress = { playAudio }>
                    <View style = {{alignItems:'center', alignSelf:'flex-start'}}>
                        <Text style = {{textAlign:'center', justifyContent:'center', color:'white'}}>
                            <MIcon name = 'voicemail' size = {30*em} color = "white"/> Voice Mail
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress = { downloadAudio }>
                    <View style = {{alignItems:'center', alignItems:'flex-end'}}>
                        <Text style = {{textAlign:'center', justifyContent:'center', color:'white'}}>
                            <MIcon name = 'cloud-download' size = {30*em} color = "white"/>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <Text style = {[ item.sender == curUser ? styles.myStyle: styles.yourStyle, styles.date ]}>
                {new Date(Number(item.date)).toLocaleString()}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    myStyle: {
        alignSelf:'flex-end', 
        backgroundColor:'#rgba(0,255,0,0.8)', 
    },
    yourStyle: {
        alignSelf:'flex-start', 
        backgroundColor:'#rgba(255,0,0,0.8)', 
    },

    text: {
        flex:1, 
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

export default AudioField;