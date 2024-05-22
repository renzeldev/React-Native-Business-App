import React, {Component, useState} from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native'

import {W, em, colors, fontSizes} from '../base'
import {textStyles} from '../styles'
import Toast from 'react-native-root-toast';
import { NormalTextButton } from './buttons';

export class TextWithLeftIcon extends Component {

    constructor(props) {
        super(props);
    }
	render() {
		return (
			<View style = {{flexDirection:'row', justifyContent:'center'}}>
                <Image source = {this.props.imageUrl} style = {[styles.iconSize, {width: this.props.fontSize, height: this.props.fontSize}]} />
                {/* <Text style = {[styles.textIcon, {marginLeft:5, fontSize:this.props.fontSize, color: this.props.color}]}>
                    {this.props.text}
                </Text> */}
            </View>
		)
	}
}

export const ShowMessageModal = (title) => {
    return (
        <MessageModal title = {title} />
    )
}

const MessageModal = ({title}) => {

    const [isVisible, setIsVisible] = useState(true);

    const closeModal = () => {
        setIsVisible(true);
    }

    return (
        <View >
            <Modal isVisible = {true} 
                swipeDirection = "left" 
                style = {{alignSelf:'center'}}
                onSwipeCancel = { closeModal }
            >
                <View style = {{marginTop:50, marginBottom:50, alignItems:'center'}}>
                    <View style={{flexDirection:'column', backgroundColor:'rgba(255,255,255,0.8)' ,borderRadius:10}}>
                        <View style = {{flexDirection:'row'}}>
                            <View style = {{flex:4,  padding:5,  justifyContent:'center'}}>
                                <Text style = {styles.title}>Message</Text>
                            </View>
                            <View style = {{flex:1, padding:5, alignItems:'flex-end', justifyContent:'center'}}>
                                <TouchableOpacity onPress = { closeModal }>
                                    <Image source = {require('../../commonUI/icon/cross.png')} style = {{width:20*em, height:20*em, resizeMode:'cover' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style = {{flexDirection:'column', borderRadius:10, padding:5, width:400*em}}>
                            <View style = {{ alignItems:'center' }} >
                                <Text style = {{alignSelf:'center', textAlign:'center', justifyContent:'center', fontSize:25*em}}>
                                    {title}
                                </Text>
                            </View>
                            <NormalTextButton onPress = {closeModal} style = {{height:50*em, backgroundColor:'#0066ff'}} title = "OK" />
                            
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export const ShowToast = (opt) => {
    const colors = {
        success:'#rgba(0,255,0,0.8)',
        warning:'#rgba(255,0,0,0.8)',
        other:'#rgba(0,0,0,0.8)'
    }
    Toast.show(opt.title, {
        containerStyle: styles.containerStyle,
        duration: opt.duration ? opt.duration : 2000,
        position: 30,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 500,
        backgroundColor: colors[`${opt.type}`],
        shadowColor: '#ccc',
        textColor: 'white',
        onPress: () => {
          alert('You clicked me!')
        },
    });
}

const styles = StyleSheet.create({
    textIcon: {
        fontSize:20,
        color:'black',
        justifyContent:'center',
    },
    iconSize: {
        width:200*em,
        height:200*em,
        resizeMode:'cover',
        justifyContent:'center',
    },
    containerStyle: {
        width:400*em,
        // alignSelf: 'flex-end'
    },
})