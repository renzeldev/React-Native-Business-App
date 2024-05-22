import React, {Component, useState, useEffect} from 'react'
import {View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, FlatList} from 'react-native'
import {em} from '../base'
import Modal from 'react-native-modal';
import { NormalTextButton } from './buttons';
import { InputMultipleTextFormWithTitle, InputSingleTextFormWithTitle, CheckField } from './inputs';
import { connect } from 'react-redux';
import { SERVER_URL } from '../../config';
import { getErrors } from '../../store/actions/errorActions';
import { addQuestion } from '../../store/actions/questionActions';
import { setSearchLoading, searchFriends } from '../../store/actions/discussActions';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress'

export const ProgressBarComponent = ({progress, isVisible, ...props}) => {
    return (
        <View >
            <Modal isVisible={isVisible} 
                // swipeDirection = "left" 
                style = {{alignSelf:'center'}}
                // onSwipeCancel = {() => {
                // 	this.props.closeModal();
                // }}
            >
                <View style = {{marginTop:50, marginBottom:50, alignItems:'center'}}>
                    <View style={{flexDirection:'column', backgroundColor:'transparent' ,borderRadius:10}}>
                    <Progress.Bar 
                        animated = {true}
                        width = {200} 
                        // animationType = 'spring'
                        progress = {progress} 
                        indeterminate={false} 
                        color= 'rgba(0, 122, 255, 1)'
                    />
                    </View>
                </View>
            </Modal>
        </View>
    )
    
} 

export const ProgressCircleComponent = ({progress, isVisible, ...props}) => {
    return (
        
        <View >
            <Modal isVisible={isVisible} 
                // swipeDirection = "left" 
                style = {{alignSelf:'center'}}
                // onSwipeCancel = {() => {
                // 	this.props.closeModal();
                // }}
            >
                <View style = {{marginTop:50, marginBottom:50, alignItems:'center'}}>
                    <View style={{flexDirection:'column', borderRadius:10}}>
                    <Progress.Pie 
                        animated = {true}
                        size={ 200*em } 
                        progress = {progress} 
                        color = 'rgba(0, 255, 0, 0.8)' 
                        // indeterminate={false} 
                        // thickness = {20*em}
                        // color= 'rgba(0, 122, 255, 1)'
                        // color={['red', 'green', 'blue']}
                    />
                    </View>
                </View>
            </Modal>
        </View>
    )
}