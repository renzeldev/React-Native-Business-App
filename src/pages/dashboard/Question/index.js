import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
// import { Modal } from '../../../commonUI/components/modal';
import { getAllQuesAns, setQuestionLoading } from '../../../store/actions/questionActions';
import axios from 'axios';
import { SERVER_URL } from '../../../config';
import spinner from '../../../commonUI/image/loading.gif';
import ModalComponent from '../../../commonUI/components/modal';
import QuestionBar from './QuestionBar';
import Spin from '../../../commonUI/components/spin';
// import Modal from 'react-native-modal';
// import Carousal from 'react-native-snap-carousel';
// import Icon from 'react-native-vector-icons/EvilIcons';
// import Icon from 'react-native-icons';


// const myIcon = ()


class News extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
    constructor(props) {
        super(props) ;
        this.state = {
            loading:'false',
            QuesAnss:[],
            isModalVisible: false,
        }
    }

    getAllQuestions() {
        this.props.setQuestionLoading();
        // this.setState({ loading:true });
        axios.get(SERVER_URL + '/main/quesandans/all')
        .then(res => this.props.getAllQuesAns(res.data))
        .catch(err => this.props.getAllQuesAns({}));
    }

    componentDidMount() {
        this.getAllQuestions();
    }
    
    _renderItem = ({item, index}) => {
        return (
            <QuestionBar answer = {item.answer} question = {item.question} />
        );
    } 

    addQuestion() {
        this.setState({isModalVisible: true});
    }

    closeModal() {
        this.setState({isModalVisible: false});
    }

    render() {
        const {loading} = this.props.ques;
        const {QuesAnss} = this.props.ques;
        return (
            <ImageBackground source={require('../../../commonUI/image/pic03.jpg')} style={{flex:1, width:'100%', height:'100%', resizeMode: 'cover'}}>
                 <View style = {{flex:1}}>
                    <TopBar title="Question" onBack={() => {Actions.pop()}} actionBtn = {this.addQuestion.bind(this)} actionBtnTitle = "+" />
                    <ModalComponent isVisible = {this.state.isModalVisible} title = "Add New Question" contentType = "NewQuestion" closeModal = {this.closeModal.bind(this)}/>
                    {/* <View style = {{flex:1, padding:20}}>
                        <TouchableOpacity>
                            <Image source = {require('../../../commonUI/icon/extra/plus.png')} 
                                style = {{ 
                                    width: 50*em, 
                                    height: 50*em, 
                                }}
                            />
                        </TouchableOpacity>
                    </View> */}
                    {/* <ImageBackground source = {spinner} style = {{alignSelf:'center', justifyContent:'center'}} /> */}
                    { loading || QuesAnss == null || QuesAnss.length == 0 ? (
                        // <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                        //     <Image source = {spinner} style = {{}} />
                        // </View>
                        <Spin text = "Loading..." />
                    ) : (
                        <View style = {{flex:1}}>
                            <ScrollView>
                                <FlatList 
                                    data = {QuesAnss} 
                                    keyExtractor={(item) => item._id} 
                                    renderItem={this._renderItem} 
                                    vertical={true} />
                            </ScrollView>
                        </View>
                    )}
                    

                </View>
            </ImageBackground>
        )
    }
}






const mapStateToProps = (state) => ({
    auth:state.auth,
    ques:state.ques,
    error: state.errorReducer,
})

const mapDispatchToProps = {
    setQuestionLoading: () => setQuestionLoading(),
    getAllQuesAns: (data) => getAllQuesAns(data)
}

export default connect(mapStateToProps, mapDispatchToProps)(News);