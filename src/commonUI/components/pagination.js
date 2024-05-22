import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';

class Pagination extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style = {{height: 100*em, alignItems:'center', backgroundColor:'transparent', width:'100%', borderWidth:1}}>
                <View style = {{flex:1, borderWidth:1, alignItems:'center', borderColor:"#0055ff", backgroundColor:'white', width:'80%', borderRadius:10,  marginBottom:10, marginTop:10}}>
                    <View style = {{flexDirection:'row',  justifyContent:'center'}}>
                        
                        <View style = {{ alignItems:'center', margin:5}}>
                            <TouchableOpacity onPress = {() => { this.props.clickFirstBtn()}} disabled = {this.props.page_number == 1 ? true: false}>
                                <Image source = {require('../../commonUI/icon/extra/first.png')} 
                                    style = {{width:50*em, height:50*em, resizeMode:'cover', justifyContent:'center', opacity: this.props.page_number == 1 ? 0.5:1 }} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style = {{alignItems:'center', margin:5 }}>
                            <TouchableOpacity onPress = {() => { this.props.clickPreviousBtn() }} disabled = {this.props.page_number == 1 ? true: false} >
                                <Image source = {require('../../commonUI/icon/extra/previous.png')} 
                                    style = {{width:50*em, height:50*em,resizeMode:'cover', justifyContent:'center', opacity: this.props.page_number == 1 ? 0.5:1 }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress = {() => { this.props.clickRangeField() }}>
                            <View style = {{ alignItems:'center', margin:5,  borderWidth:1, borderRadius:5, borderStyle:'dotted', borderColor:'black'}}>
                                
                                <Text style = {{textAlign:'center', justifyContent:'center', fontSize:30*em, minWidth:200*em}}>
                                    {`${this.props.page_number}`} / {`${this.props.max_page_number}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style = {{alignItems:'center',margin:5}}>
                            <TouchableOpacity onPress = {() => {this.props.clickNextBtn()}} disabled = {this.props.page_number == this.props.max_page_number ? true: false}>
                                <Image source = {require('../../commonUI/icon/extra/next.png')} style = {{width:50*em, height:50*em,resizeMode:'cover', justifyContent:'center', opacity: this.props.page_number == this.props.max_page_number ? 0.5:1}} />
                            </TouchableOpacity>
                        </View>
                        <View style = {{ alignItems:'center', margin:5}}>
                            <TouchableOpacity onPress = {() => { this.props.clickLastBtn()}}>
                                <Image source = {require('../../commonUI/icon/extra/last.png')} style = {{width:50*em, height:50*em, resizeMode:'cover',justifyContent:'center', opacity: this.props.page_number == this.props.max_page_number ? 0.5:1 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> 
            </View>
        )
    }
}

export default Pagination;