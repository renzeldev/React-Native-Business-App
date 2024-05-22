import React, { useState, useEffect, useReducer } from 'react';
import { TextInput, View, Text, Alert } from 'react-native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
// import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';


const Service = (props) => {

  const navigationOptions = {
		headerStyle: {
			display: 'none'
		}
  }

  const initialState = {
    text : ''
  }

  const reducer = (state, action) => {
    switch ( action.type ) {
      case 'GET_TEXT':
        return {
          ...state,
          text: action.payload
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeText = (value) => {
    dispatch({
      type: 'GET_TEXT',
      payload: value
    })
  }

  useEffect(() => {
    const url = "http://10.0.3.2:3000/chatupload/voice/HS981014_TO_khs0101/HS981014_khs0101_1685580709251.aac";
    // ReactNativeAudioStreaming.pause();
    // ReactNativeAudioStreaming.resume();
    // ReactNativeAudioStreaming.play(url, {showInAndroidNotifications: true});
    // Sound.setCategory('Playback');
    // Alert.alert(RNFS.ExternalDirectoryPath, RNFS.ExternalStorageDirectoryPath);
    // var whoosh = new Sound(RNFS.ExternalStorageDirectoryPath + '/Music/test.aac', Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     console.log('failed to load the sound', error);
    //     return;
    //   }
    //   // loaded successfully
    //   console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    
    //   // Play the sound with an onEnd callback
    //   whoosh.play((success) => {
    //     if (success) {
    //       console.log('successfully finished playing');
    //     } else {
    //       console.log('playback failed due to audio decoding errors');
    //     }
    //   });
    // });
    
    // Reduce the volume by half
    // whoosh.setVolume(0.5);
    
    // // Position the sound to the full right in a stereo field
    // whoosh.setPan(1);
    
    // // Loop indefinitely until stop() is called
    // whoosh.setNumberOfLoops(-1);
    
    // // Get properties of the player instance
    // console.log('volume: ' + whoosh.getVolume());
    // console.log('pan: ' + whoosh.getPan());
    // console.log('loops: ' + whoosh.getNumberOfLoops());
    
    // Seek to a specific point in seconds
    // whoosh.setCurrentTime(2.5);
    
    // // Get the current playback point in seconds
    // whoosh.getCurrentTime((seconds) => console.log('at ' + seconds));
    
    // // Pause the sound
    // whoosh.pause();
    
    // // Stop the sound and rewind to the beginning
    // whoosh.stop(() => {
    //   // Note: If you want to play a sound after stopping and rewinding it,
    //   // it is important to call play() in a callback.
    //   whoosh.play();
    // });
    
    // Release the audio player resource
    // whoosh.release();
    return () => {
      // whoosh.stop(() => {
        
      // })
    }
  },[])

  return (
    <View>
      <TextInput 
        style = {{ borderWidth: 1}}
        onChangeText = { onChangeText }
      />
      <Text>
        { state.text }
      </Text>
    </View>
    
  )
}

export default Service;