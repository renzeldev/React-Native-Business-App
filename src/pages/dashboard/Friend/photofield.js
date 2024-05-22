
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import { ShowToast } from '../../../commonUI/components/elements';
import { SERVER_URL, SERVER } from '../../../config';
import ModalComponent from '../../../commonUI/components/modal';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS, { exists } from 'react-native-fs';
import { ProgressBarComponent } from '../../../commonUI/components/progress';

const PhotoField = ({item, curUser, targetUser, ...props}) => {
    const [flag, setFlag] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isProgressVisible, setIsProgressVisible] = useState(false);
    // const filename = item.text.split('/')[item.text.split('/').length-1];
    const filename = item.text;
    const [progress, setProgress] = useState(0);
    const photoUri = (item.receiver == curUser ? SERVER + '/chatupload/photo/' + targetUser + '_TO_' + curUser + '/' + filename : SERVER + '/chatupload/photo/' + curUser + '_TO_' + targetUser + '/' + filename);
    const URL = (item.receiver == curUser ? SERVER_URL + '/chatdownload/photo/' + targetUser + '/' + curUser + '/' + filename : SERVER_URL + '/chatdownload/photo/' + curUser + '/' + targetUser + '/' + filename);
    
    
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
        setProgress(0);
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
            processDivider: 1,
        }).promise.then(res => {
            setProgress(1);
            setFlag(true);
            setIsProgressVisible(false);
            ShowToast({
                type:'other', 
                title: 'You can check your ' + toFileName + ' file in Downloads folder of picture.', 
                duration:3000
            });
            // props.showMessageModal('You can check your ' + String(Date.now()) + '_' + filename + ' file in Downloads folder of picture.')
        
            
        }).catch(err => {
            Alert.alert('Whoops', 'Internal Server Error.');
        }) 
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    return (
        <View style = {[item.sender == curUser ? styles.myStyle: styles.yourStyle, styles.text]}>
            <ModalComponent 
                isVisible = {isModalVisible} 
                title = "Photo View" 
                contentType = "PhotoView" 
                // image = {item.text}
                image = {photoUri}
                closeModal = {closeModal}
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
            </View>
            <TouchableOpacity onPress = {downloadPhoto}>
                <View style = {{alignItems:'center'}}>
                    <Text style = {{textAlign:'center', justifyContent:'center', color:'white'}}>
                        Click here to download.<MIcon name = 'cloud-download' size = {25*em} color = "white"/>
                    </Text>
                </View>
            </TouchableOpacity>
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

export default PhotoField;