import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';

class QuestionBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnswerShown:false,
            animatedValue:new Animated.Value(0)
        }
    }

    displayAnswer() {
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: this.state.isAnswerShown? 0:200*em,
                duration:300
            }
        ).start();
        this.setState({isAnswerShown: !this.state.isAnswerShown});
    }   

    render() {
        return (
            <View style = { styles.questionBar }>
                <View style = {[styles.container, styles.questionStyle]}>
                    <TouchableOpacity onPress = {this.displayAnswer.bind(this)}>
                        <Text style = {styles.questionText}>
                            {this.props.question}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style = {[{height: this.state.animatedValue}, styles.container, styles.answerStyle]}>
                    <TextInput 
                        multiline = {true} 
                        style = {styles.answerText} 
                        value = {this.props.answer} 
                        textAlignVertical = "top"
					    underlineColorAndroid = 'transparent' 
                        disabled>
                    </TextInput>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	container: {
      flex: 1,
	  // justifyContent: 'center',
	  // backgroundColor: '#F5FCFF'
	},
	instructions: {
        fontSize:25, 
        color:'white', 
        justifyContent:'center', 
        padding:20, 
        marginTop:50, 
        marginBottom:50
    },
    
    imageside: {
        flex:1,
        marginTop:30,
        marginBottom:30,
        alignItems:'center',
        flexDirection:'column'
        // width:'20%',
        // height: 100,
        // padding:'auto',
    },
  
	inputform: {
	  marginTop: 50*em,
	  flex:1,
	  justifyContent:'center'
	}, 
  
	questionText: {
	  textAlign:'left', 
	  margin:5, 
	  padding:3, 
	  color:'white', 
	  alignItems:'center'
    },

    answerText: {
        textAlign:'left', 
        margin:5, 
        padding:3, 
        color:'black', 
        alignItems:'center',
        height:'100%',
    },  
    
    questionBar: {
        flex: 1, 
        marginTop:30,  
        marginLeft:20, 
        marginRight:20, 
        flexDirection:'column'
    },

    answerStyle: {
        backgroundColor:'white',  borderWidth:5, borderTopWidth:0, borderRadius:10
    },

    questionStyle: {
        borderWidth:5, borderRadius:10, backgroundColor:'#2266aa'
    }
});

export default QuestionBar;