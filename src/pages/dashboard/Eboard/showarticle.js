import React, {Component} from 'react';
import {BackHandler, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
import { TextWithLeftIcon, ShowToast } from '../../../commonUI/components/elements';
import { InputMultiTextWithTitle } from '../../../commonUI/components/inputs';
import { getArticles, setEboardLoading, countArticles, submitComment } from '../../../store/actions/eboardAction';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';
import { SERVER_URL, SERVER } from '../../../config';
import spinner from '../../../commonUI/image/loading.gif';
import ModalComponent from '../../../commonUI/components/modal';
import Pagination from '../../../commonUI/components/pagination';
import SearchField from '../../../commonUI/components/searchfield';
import isEmpty from '../../../store/validation/is-empty';

class ShowArticle extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
    constructor(props) {
        super(props) ;
        this.state = {
            // loading:'false',
            // article:{},
            isModalVisible: false,
        }
        this.handleBackBtnClick = this.handleBackBtnClick.bind(this);
    }

    raiseArticleViews() {
        if(this.props.auth.user.handle != this.props.eboard.article.user) {
            axios.get(`${SERVER_URL}/main/eboard/views/${this.props.eboard.article._id}`);
        }
    }


    componentDidMount() {
        this.raiseArticleViews();
        this.props.navigation.addListener('willFocus', () => {
            this.backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                this.handleBackBtnClick
            )
        })

        this.props.navigation.addListener('willBlur', () => {
            if(this.backHandler != null) {
                this.backHandler.remove();
            }
        })
        // this.setState({article: this.props.eboard.article});
    }

    handleBackBtnClick() {
        setTimeout(() => Actions.eboard(),500);
        // Actions.eboard();
        
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.eboard.comments) {
            this.props.eboard.article.comments = nextProps.eboard.comments;
        }
    };

    componentWillUnmount() {
        // Actions.eboard();
        // this.countArticles(this.props.eboard.searchedItem);
        // this.getMyFavourites();
        // this.getArticles(this.props.eboard.page_number, this.props.eboard.searchedItem);
    }


    
    getArticles(page_number, searchedItem) {
        
        // dispatch(setEboardLoading);
        this.props.setEboardLoading();
        // const {searchedItem} = this.state;
        if(searchedItem.handle.length == 0 && searchedItem.title.length == 0 && searchedItem.content.length == 0) {
            axios.get(SERVER_URL + `/main/eboard/show/${page_number}`)
            .then(res => this.props.getArticles(res.data))
            .catch(err => this.props.getArticles([]));
        } else {
            axios.post(SERVER_URL + `/main/eboard/searched/show/${page_number}`, searchedItem)
            .then(res => this.props.getArticles(res.data))
            .catch(err => this.props.getArticles([]));
            //window.alert(searchedItem.handle)
            //console.log(searchedItem);
        }
    }

    // getMyFavourites() {
    //     // Alert.alert("favo");
    //     axios.get(`${SERVER_URL}/main/eboard/getMyFavor`)
    //     .then( res => this.setState({favourites: res.data}));
    //     // .then( res => this.props.getMyFavourites(res.data));
    // }

    closeModal() {
        this.setState({isModalVisible: false});
    }

    _renderItem = ({item, index}) => {
        return (
            <CommentBar comment = {item}/>
        )
    }

    

    render() {
        const {loading} = this.props.eboard;
        const {article} = this.props.eboard;
        return (
            
            <View style = {{flex:1}}>
                <TopBar title="Article" onBack={() => {
                    Actions.eboard();
                }} />
                <ModalComponent 
                    isVisible = {this.state.isModalVisible} 
                    title = "Input page number" 
                    contentType = "InputNumber" 
                    closeModal = {this.closeModal.bind(this)}
                />
                <View style = {{flex:1, paddingBottom:10}}>
                    <ScrollView 
                        style = {{}}
                        ref  = 'article'  
                        onContentSizeChange={() => {
                            this.refs.article.scrollToEnd({animated: true});
                        }} 
                    >
                        <HeaderBar 
                            article = {article}
                            {...this.props}
                        />
                        <ContentBar
                            article = {article}
                        />
                        <AddCommentBar id = {article._id} {...this.props}/>
                        <FlatList 
                            data = {article.comments} 
                            keyExtractor={(item) => item._id} 
                            renderItem={this._renderItem} 
                            vertical={true} />
                    </ScrollView>
                    
                </View>
            </View>
        )
    }
}


class HeaderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavourite: false
        }
    }

    addToMyFavor() {
        this.setState({ isFavourite: true });
        axios.get(`${SERVER_URL}/main/eboard/addToMyFavor/${this.props.article._id}`)
        .then( res => {
            this.props.addToMyFavourites(res.data);
            ShowToast({ type: 'success', title: 'Add to your favourites.', duration:2000 });
        })
    }

    componentDidMount() {
        const isFavourite = (this.props.eboard.favourites.indexOf(this.props.article._id) != -1);
        this.setState({ isFavourite: isFavourite });
    }

    render() {
        const star = this.state.isFavourite ? require('../../../commonUI/icon/star.png') : require('../../../commonUI/icon/star-empty.png')
        const isMyArticle = (this.props.article.user == this.props.auth.user.handle);
        return (
            <View style = {{padding: 10, flexDirection:'row'}}>
                <View style = {{flex:1, flexDirection:'column'}}>
                    <View style = {{flex:5, paddingTop:20, alignItems:'center'}}>
                        <Image 
                            source = {{uri : SERVER + '/avatar/' + this.props.article.user + '.png'}}
                            // source = {require('../../../commonUI/icon/people19.png')} 
                            style = {{justifyContent:'center', resizeMode:'cover', width:120*em, height:180*em}}
                        />
                    </View>
                    <View style = {{flex:1, alignItems:'center'}}>
                        <Text style = {{textAlign:'center', fontSize:25*em, color:'#0088ee', justifyContent:'center'}}>
                            {this.props.article.user}
                        </Text>
                    </View>
                </View>
                <View style = {{flex:4, paddingLeft:10, flexDirection:'column'}}>
                    <View style = {{flex:3, paddingBottom:5, borderColor:'#001122', justifyContent:'center'}}>
                        <Text style = {{fontSize:50*em, justifyContent:'center', color:'#0088ee'}}>
                            {this.props.article.title}
                        </Text> 
                    </View>
                    <View style = {{flex:1, justifyContent:'center'}}>
                        <Text>
                            Field:{this.props.article.type}
                        </Text>
                    </View>
                    <View style = {{flex:1, marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        
                        <View style = {{flex:1,  flexDirection:'row'}}>
                            <Image source = {require('../../../commonUI/icon/thumbup.png')} style = {styles.iconStyle} />
                            <Text style = {{justifyContent:'center'}}>{`${this.props.article.agree.length}`}</Text>
                        </View>
                        <View style = {{flex:1,  flexDirection:'row'}}>
                            <Image source = {require('../../../commonUI/icon/thumbdown.png')} style = {styles.iconStyle} />
                            <Text style = {{justifyContent:'center'}}>{`${this.props.article.agree.length}`}</Text>
                        </View>
                        <View style = {{flex:1,  flexDirection:'row'}}>
                            <Image source = {require('../../../commonUI/icon/extra/info.png')} style = {styles.iconStyle} />
                            <Text style = {{justifyContent:'center'}}>{`${this.props.article.comments.length}`}</Text>
                        </View>
                        <View style = {{flex:1,  flexDirection:'row'}}>
                            <Image source = {require('../../../commonUI/icon/eye.png')} style = {styles.iconStyle} />
                            <Text style = {{justifyContent:'center'}}>{`${this.props.article.views}`}</Text>
                        </View>
                        <View style = {{flex:1,  flexDirection:'row'}}>
                            <TouchableOpacity 
                                onPress = { this.addToMyFavor.bind(this) }
                                disabled = { isMyArticle || this.state.isFavourite }    
                            >
                                <Image source = { star } style = { styles.iconStyle } />
                            </TouchableOpacity>
                        </View>
                    </View> 
                </View>
            </View>
        )
    }
}

class ContentBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style = {{margin:20, borderWidth:2, borderColor:"#006688", borderStyle:'dashed', borderRadius:10}}>
                <TextInput 
                    multiline = {true} 
                    value = {this.props.article.content} 
                    style = {{fontSize:25*em, height:700*em, color:'black'}} 
                    textAlignVertical = "top"
					underlineColorAndroid = 'transparent'
                    // editable = {false}
                    scrollEnabled = {true}
                />
                {/* <ScrollView>
                <View style = {{flex:1}}>
                <Text style = {{fontSize: 25*em, padding:5}}>
                    {this.props.article.content}
                </Text>
                </View>
                </ScrollView> */}
            </View>
        )
    }
}

class CommentBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnswerShown:false,
            animatedValue:new Animated.Value(0),
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
            <View style = { styles.commentBar }>
                <View style = {[styles.container, styles.commentHeader]}>
                    <TouchableOpacity onPress = {this.displayAnswer.bind(this)}>
                        <Text style = {styles.commentHeaderText}>
                            {this.props.comment.handle + "'s comment"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style = {[{height: this.state.animatedValue}, styles.container, styles.commentMain]}>
                    <TextInput 
                        multiline = {true} 
                        style = {[styles.commentMainText, {borderWidth: this.state.isAnswerShown ? 1:0, borderRadius:10}]} 
                        value = {this.props.comment.text} 
                        textAlignVertical = "top"
					    underlineColorAndroid = 'transparent'
                        disabled
                    >
                    </TextInput>
                </Animated.View>
            </View>
        )
    }
}


class AddCommentBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnswerShown:false,
            animatedValue:new Animated.Value(0),
            text:''
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

    submitComment() {
        const comment = {
            text: this.state.text,
            handle: this.props.auth.user.handle
        }
        this.displayAnswer();
        axios.post(SERVER_URL + `/main/eboard/comment/${this.props.id}`, comment)
        .then(res => this.props.addComment({comments:res.data, id: this.props.id}))
        .catch(err => {
            if(err.response.data.nocomment) {
            Alert.alert(err.response.data.nocomment)
            }
            if(err.response.data.notallowed) {
            Alert.alert(err.response.data.notallowed)
            }
            if(err.response.data.noarticle) {
            Alert.alert(err.response.data.noarticle);
            }
        });
        
    }

    onChangeText(value) {
        this.setState({text:value});
    }

    render() {
        return (
            <View style = { styles.commentBar }>
                <View style = {[styles.container, styles.commentHeader, {width:'40%', marginBottom:20}]}>
                    <TouchableOpacity onPress = {this.displayAnswer.bind(this)}>
                        <Text style = {[styles.commentHeaderText, {textAlign:'center'}]}>
                            Add your opinion.
                        </Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style = {[{height: this.state.animatedValue}, styles.container, styles.commentMain, { flexDirection:'column'}]}>
                    <View style = {{flex:3}}>
                        <TextInput 
                            multiline = {true} 
                            style = {[styles.commentMainText, {borderWidth: this.state.isAnswerShown ? 1:0, borderRadius:10}]}
                            textAlignVertical = "top"
                            underlineColorAndroid = 'transparent'
                            onChangeText = {this.onChangeText.bind(this)}    
                            >

                        </TextInput>
                    </View>
                    <View style = {{flex:1, flexDirection:'row', margin:10, alignSelf:'flex-end'}}>
                        <TouchableOpacity onPress = {this.submitComment.bind(this)}>
                            <View style = {{flexDirection:'row', backgroundColor:'#004488', height:50*em, padding:5, borderRadius:5}}>
                                <Text style = {{marginRight:10, justifyContent:'center', color:'white'}}>
                                    Submit
                                </Text>
                                <Image source = {require('../../../commonUI/icon/extra/arrow_up2.png')} style = {{width:30*em, height:30*em, justifyContent:'center'}}/>
                            </View>                        
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        )
    }
}



const mapStateToProps = (state) => ({
    auth:state.auth,
    eboard:state.eboard,
    error: state.errorReducer,
})

const mapDispatchToProps = {
    setEboardLoading: () => setEboardLoading(),
    getArticles : (articles) => getArticles(articles),
    countArticles: (number) => countArticles(number),
    addComment: (data) => submitComment(data),
    addToMyFavourites: (id) => {
        return {
            type: 'ADD_TO_FAVOURITES',
            payload: id,
        }
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        width:30*em, 
        height:30*em, 
        resizeMode:'cover', 
        marginLeft:5, 
        marginRight:5
    },

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
    
      commentHeaderText: {
        textAlign:'left', 
        margin:5, 
        padding:3, 
        color:'white', 
        alignItems:'center'
      },
  
      commentMainText: {
          textAlign:'left', 
          margin:5, 
          padding:3, 
          color:'black', 
          alignItems:'center',
          height:'100%',
      },  
      
      commentBar: {
          flex: 1, 
          marginTop:10,  
          marginLeft:20, 
          marginRight:20, 
          flexDirection:'column'
      },
  
      commentMain: {
          backgroundColor:'white',  
        //   borderWidth:1, borderTopWidth:0, borderRadius:10
      },
  
      commentHeader: {
          borderWidth:1, borderRadius:10, backgroundColor:'#2266aa'
      }

})

export default connect(mapStateToProps, mapDispatchToProps)(ShowArticle);