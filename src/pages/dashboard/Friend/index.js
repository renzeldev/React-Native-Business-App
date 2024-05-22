import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
import { TextWithLeftIcon } from '../../../commonUI/components/elements';
import { getArticles, setEboardLoading, countArticles } from '../../../store/actions/eboardAction';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';
import { SERVER_URL } from '../../../config';
import spinner from '../../../commonUI/image/loading.gif';
import ModalComponent from '../../../commonUI/components/modal';
import Pagination from '../../../commonUI/components/pagination';
import SearchField from '../../../commonUI/components/searchfield';
import isEmpty from '../../../store/validation/is-empty';
import ModalDropdown from 'react-native-modal-dropdown'
import FastImage from 'react-native-fast-image';
import { InputSingleTextFormWithTitle, CheckField } from '../../../commonUI/components/inputs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setSearchLoading, searchFriends, inviteFriend, getFriends, deleteFriend, cancelRequest } from '../../../store/actions/discussActions';
import {getErrors} from '../../../store/actions/errorActions';
import { NormalTextButton } from '../../../commonUI/components/buttons';


    
class Friend extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
    constructor(props) {
        super(props) ;
        this.state = {
            loading:'false',
            isMale:true,
            isFemale:true,
            name:"",
            handle:"",
            birthday:"",
            phone_number:"",
            searchResult:[],
            friends:[],
            showfriendslist:[],
            toshowwhat: '',
            isModalVisible: false,
            isListModalVisible: false
        }
    }

    componentDidMount() {
        this.getFriends();
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.discuss.searchResult) {
            this.setState({searchResult: nextProps.discuss.searchResult});
        }

        if(nextProps.discuss.friends) {
            var friends = nextProps.discuss.friends;
            this.setState({friends: friends});
            this.setState({ showfriendslist: friends});
            this.setState({ toshowwhat: 'all'});
        }
    }

    getFriends() {
        axios.get(SERVER_URL + '/main/discuss/getfriend')
        .then(res => this.props.getFriends(res.data))
        .catch(err => this.props.getErrors(err.response.data))
    }
    
    _renderItem = ({item, index}) => {
        return (
            <FriendDetail friend = {item} {...this.props}/>
        );
    } 

    onChangeTextField(field, value) {
		this.setState({[field]:value});
	}

	changeGender(value) {
        if(value == 'Male') {
            this.setState({isMale: !this.state.isMale});
        } else {
            this.setState({isFemale: !this.state.isFemale});
        }
	}


    closeModal() {
        this.setState({isModalVisible: false});
    }

    closeListModal() {
        this.setState({isListModalVisible: false})
    }

    openListModal() {
        this.setState({isListModalVisible: true});
    }

    search() {
        const searchItem = {
            name:this.state.name,
            handle: this.state.handle,
            birthday: this.state.birthday,
            phone_number: this.state.phone_number,
            gender:""
        }
            if(this.state.isMale&&(!this.state.isFemale)) {
            searchItem.gender = "male"
        }
            if(!this.state.isMale&&(this.state.isFemale)) {
            searchItem.gender = 'female'
        }
        this.props.setSearchLoading();
        axios.post(SERVER_URL+ '/main/discuss/search', searchItem)
        .then(res => this.props.searchFriends(res.data))
        .catch(err => this.props.searchFriends([]));
    }

    goToPage(field) {
        switch(field) {
            case 'chatroom':
                Actions.chatroom();
            default:
                return false;
        }
    }
    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
          
            <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lightgray' : 'white', borderBottomWidth:1, borderColor:'#006688'}]}>
                <TouchableOpacity onPress = {() => {
                    this.dropdown.hide();
                    this.goToPage(rowData.field);
                    // Actions.popTo(rowData.field);
                    // Actions.replace(rowData.field);
                }}>
                <View style = {{flexDirection:'row'}}>
                    <View style = {{width:25, alignItems:'center', justifyContent:'center'}}>
                        <FIcon 
                            name = {rowData.Icon} 
                            size = {20} 
                            color = "#006688"/>
                    </View>
                    <Text style={[styles.dropdown_2_row_text]}>    
                        {`${rowData.name}`}
                    </Text>
                </View>
              </TouchableOpacity>
            </View>
          
        );
    }

    render() {
        const {loading} = this.props.discuss;
        return (
            
            <View style = {{flex:1, flexDirection:'column', marginBottom:20}}>
                
                <TopBar title="Friend" onBack={() => {Actions.pop()}} />
                <ModalComponent 
                    isVisible = {this.state.isModalVisible} 
                    title = "Search your friend" 
                    contentType = "SearchFriend" 
                    closeModal = {this.closeModal.bind(this)}
                    openListModal = {() => {this.setState({isListModalVisible: true})}}
                />
                <ModalComponent 
                    isVisible = {this.state.isListModalVisible}
                    title = "Search Result" 
                    contentType = "SearchFriendList"
                    friends = {this.state.searchResult} 
                    closeModal = {this.closeListModal.bind(this)}
                    {...this.props}
                />
                <View style = {{padding:10, flexDirection:'row'}}>
                    <Text style = {{textAlign:'left', justifyContent:'center', fontSize:40*em, color:"#006688"}}>
                        Friend List
                    </Text>
                    <View style = {{position:'absolute', right:10, top:20}}>
                        <ModalDropdown 
                            ref={(ref) => this.dropdown = ref}
                            style={styles.dropdown_6}
                            textStyle={styles.dropdown_2_text}
                            dropdownStyle={styles.dropdown_2_dropdown}
                            options={[
                                {name:'Chatting Room', Icon:'wechat', field:'chatroom'},
                                {name:'Email Box', Icon:'envelope-square', field:'emailbox'},
                                {name:'Multi Chatting', Icon:'users', field:'multichat'},
                                {name:'Voice Mail', Icon:'microphone', field:'voiceemail'}
                            ]}
                            renderRow={this._dropdown_2_renderRow.bind(this)}
                        >
                            <Icon name = "menu" size = {25} backgroundColor = 'transparent' color = "#006688" />
                        </ModalDropdown>
                    </View>
                </View>
                <View style = {{margin:10, flexDirection:'row', borderRadius:10, borderColor:'#ccc', borderWidth:2,  marginLeft:20, marginRight:20}}>
                    <View style = {{flex:1, borderRightWidth:1, borderColor:'#ccc', backgroundColor:this.state.toshowwhat == 'all' ? 'rgba(0,0,255,0.6)' : 'transparent'}}>
                        <TouchableOpacity onPress = {() => {
                            this.setState({toshowwhat:'all'})
                            this.setState({showfriendslist: this.state.friends})
                        }}>
                            <Text style = {{color:'black', textAlign:'center'}}>
                                All
                            </Text>   
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex:1, borderRightWidth:1, borderColor:'#ccc', backgroundColor:this.state.toshowwhat == 'friend' ? 'rgba(0,0,255,0.6)' : 'transparent'}}>
                        <TouchableOpacity onPress = {() => {
                            this.setState({toshowwhat:'friend'});
                            this.setState({showfriendslist: this.state.friends.filter(mem => mem.type == 'friend')})
                        }}>
                            <Text style = {{color:'black', textAlign:'center'}}>
                                Friend
                            </Text>   
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex:1, borderLeftWidth:1, borderRightWidth:1, borderColor:'#ccc', backgroundColor:this.state.toshowwhat == 'request' ? 'rgba(0,0,255,0.6)' : 'transparent'}}>
                        <TouchableOpacity onPress = {() => {
                            this.setState({toshowwhat:'request'});
                            this.setState({showfriendslist: this.state.friends.filter(mem => mem.type == 'request')})
                        }}>
                            <Text style = {{color:'black', textAlign:'center'}}>
                                Waiting
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex:1, borderLeftWidth:1, borderColor:'#ccc', backgroundColor:this.state.toshowwhat == 'receive' ? 'rgba(0,0,255,0.6)' : 'transparent'}}>
                        <TouchableOpacity onPress = {() => {
                            this.setState({toshowwhat:'receive'})
                            this.setState({showfriendslist: this.state.friends.filter(mem => mem.type == 'receive')})
                        }}>
                            <Text style = {{color:'black', textAlign:'center'}}>
                                New Coming
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{height:80*em, flexDirection:'row',borderWidth:1, borderColor:"#ccc", alignItems:'center', marginTop:10, padding:10}}>
                    <View style = {{flex:3, height:'auto', justifyContent:'center'}}>
                        <Text style = {{fontSize:25*em, color:"#006688", textAlign:'center'}}>
                            Name
                        </Text>
                    </View>
                    <View style = {{flex:4, height:'auto', justifyContent:'center'}}>
                        <Text style = {{fontSize:25*em, color:"#006688", textAlign:'center'}}>
                            Handle
                        </Text>
                    </View>
                    <View style = {{height:'auto', flex:1, justifyContent:'center'}}>
                        <FIcon name = "intersex" size = {30} color = "#006688" />            
                    </View>
                    <View style = {{flex:3, height:'auto', justifyContent:'center'}}>
                        <Text style = {{fontSize:25*em, textAlign:'center', color:"#006688"}}>
                            Status
                        </Text>
                    </View>
                    <View style = {{justifyContent:'center', height:'auto', flex:3}}>
                        <Text style = {{fontSize:25*em, textAlign:'center', color:"#006688"}}>
                            Action
                        </Text>
                    </View>
                </View>
                <ScrollView>
                    <FriendList friends = {this.state.showfriendslist} {...this.props} />
                </ScrollView>
                <NormalTextButton 
                    style = {{backgroundColor:"#006688"}}
                    title = "Search your friends."
                    onPress = {() => { this.setState({isModalVisible: true })} } 
                />
                {this.props.discuss.loading && (
                    <View style = {{alignItems:'center', justifyContent:'center'}}>
                        <Image source = {spinner} style = {{zIndex:999}} />
                    </View>
                )}
            </View>
        )
    }
}



const FriendDetail = ({friend, ...props}) => {
    return (
        <View style = {{flexDirection:'row', borderBottomWidth:1, borderColor:"#ccc", alignItems:'center', margin:0, padding:10}}>
            <View style = {{width:200*em, margin:5, justifyContent:'center'}}>
                <Text style = {{fontSize:25*em, textAlign:'center'}}>
                    {friend.name}
                </Text>
            </View>
            <View style = {{width: 200*em, margin:5, justifyContent:'center'}}>
                <Text style = {{fontSize:25*em, textAlign:'center'}}>
                    {friend.handle}
                </Text>
            </View>
            <View style = {{width: 50*em, margin:5, justifyContent:'center'}}>
                    {friend.gender == 'male'? (
                        <FIcon name = "male" size = {30} color = 'black' />
                    ) : (
                        <FIcon name = "female" size = {30} color = 'black' />
                    )}
            </View>
            <View style = {{justifyContent:'center'}}>
                <FIcon.Button name = "user-plus" size = {30} color = "white" backgroundColor="#3b5998" onPress = {() => {
                    axios.post(SERVER_URL + '/main/discuss/invite', friend) 
                    .then(res => props.inviteFriend(res.data))
                    .catch(err => props.getErrors(err.response.data))
                }}>
                    Invite
                </FIcon.Button>
            </View>
        </View>
    )
}


const FriendListItem = ({friend, ...props}) => {

    const deleteFriend = () => {
        axios.post(SERVER_URL + '/main/discuss/erase/' + friend.handle) 
        .then(res => props.getFriends(res.data))
        .catch(err => props.getErrors(err.response.data));
    }

    const cancelInvite = () => {
        axios.post(SERVER_URL + `/main/discuss/cancelInvite/${friend.handle}`)
        .then(res => props.getFriends(res.data))
        .catch(err => props.getErrors(err.response.data));
    }
    const cancelRequest = () => {
        axios.post(SERVER_URL + '/main/discuss/cancelRequest/' + friend.handle) 
        .then(res => props.getFriends(res.data))
        .catch(err => props.getErrors(err.response.data));
    }

    const agreeFriend = () => {
        axios.post(SERVER_URL + '/main/discuss/agreefriend', friend)
        .then(res => props.getFriends(res.data))
        .catch(err => props.getErrors(err.response.data));
    }

    return (
        <View style = {{flex:1, flexDirection:'row', borderWidth:1, borderColor:"#ccc", alignItems:'center', margin:0, padding:10}}>
            <View style = {{flex:3, height:'auto', justifyContent:'center'}}>
                <Text style = {{fontSize:25*em, textAlign:'center'}}>
                    {friend.name}
                </Text>
            </View>
            <View style = {{flex:4, height:'auto', justifyContent:'center'}}>
                <Text style = {{fontSize:25*em, textAlign:'center'}}>
                    {friend.handle}
                </Text>
            </View>
            <View style = {{height:'auto', flex:1, justifyContent:'center'}}>
                    {friend.gender == 'male'? (
                        <FIcon name = "male" size = {30} color = 'black' />
                    ) : (
                        <FIcon name = "female" size = {30} color = 'black' />
                    )}
            </View>
            <View style = {{flex:3, height:'auto', justifyContent:'center'}}>
                <Text style = {{fontSize:25*em, textAlign:'center'}}>
                    {friend.type == 'friend' && 'Friend'}
                    {friend.type == 'request' && 'Waiting'}
                    {friend.type == 'receive' && 'New'}
                </Text>
            </View>
            <View style = {{justifyContent:'center', height:'auto', flex:3}}>
                {friend.type == 'friend' && (
                    <View style = {{alignSelf:'center'}}>
                        <MIcon.Button name = "heart-broken"  size = {25*em} color = "white" backgroundColor="rgba(255,0,0,0.5)" onPress = { deleteFriend }>
                        </MIcon.Button>
                    </View>
                )}
                {friend.type == 'request' && (
                    <View style = {{alignSelf:'center'}}>
                        <FIcon.Button name = "user-times" size = {25*em} color = "white" backgroundColor="rgba(1,0,0,0.5)" onPress = { cancelInvite }>
                        </FIcon.Button>
                    </View>
                )}
                {friend.type == 'receive' && (
                    <View style = {{flexDirection:'row', alignSelf:'center'}}>
                        <FIcon.Button name = "user-times" size = {25*em} color = "white" backgroundColor="rgba(0,0,0,0.5)" onPress = { cancelRequest }>
                        </FIcon.Button>
                        <FIcon.Button name = "user-plus" size = {25*em} color = "white" backgroundColor="rgba(0,0,255,0.5)" onPress = { agreeFriend }>
                        </FIcon.Button>
                    </View>
                )}
                
            </View>
        </View>
    )
}
const FriendList = ({friends, ...props}) => {

    _renderItem = ({item, index}) => {
        return (
            <FriendListItem friend = {item} {...props}/>
        )
    }

    return (
        <View style = {{flexDirection:'column', borderWidth:1, borderColor:"#ccc"}}>
            
            {/* <View style = {{}}> */}
                {friends.length == 0 ? (
                    <View style = {{height:800*em, alignItems:'center', justifyContent:'center'}}>
                        <Text style = {{textAlign:'center', fontSize:25*em}}>
                            There are no friends.
                        </Text>
                    </View>
                ) : (
                    <FlatList 
                        data = {friends} 
                        keyExtractor={(item) => item._id} 
                        renderItem={this._renderItem} 
                        vertical={true} />
                )}
                    
            {/* </View> */}
        </View>
    )
}



const mapStateToProps = (state) => ({
    discuss: state.discuss,
    error: state.errorReducer,
})

const mapDispatchToProps = {
    setSearchLoading : () => setSearchLoading(),
    searchFriends: (friends) => searchFriends(friends),
    inviteFriend: (friend) => inviteFriend(friend),
    getErrors: (errors) => getErrors(errors),
    getFriends: (friends) => getFriends(friends)
}

const styles = StyleSheet.create({
    iconStyle: {
        width:30*em, 
        height:30*em, 
        resizeMode:'cover', 
        justifyContent:'center', 
        marginLeft:30, 
        marginRight:3
    },

    dropdown_6: {
        // zIndex:9999,
        flex: 1,
        left: 8,
        alignItems:'center',
        justifyContent:'center',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: 200,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
        marginTop:15,
        height:'auto',
        maxHeight:200
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(Friend);