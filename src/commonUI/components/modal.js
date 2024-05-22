import React, {Component, useState, useEffect, useMemo} from 'react'
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, FlatList, Animated } from 'react-native'
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
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

// export class Modal extends Component {
//   render() {
// 		return (
// 			<View style={{
// 				position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
// 				alignItems: 'center', justifyContent: 'center'
// 			}}>
// 				<View style={{
// 					backgroundColor: '#888',
// 					opacity: 0.4,
// 					position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
// 				}}/>
// 				<View style={{
// 					padding: em*10,
// 					alignItems: 'center',
// 					backgroundColor: '#fff',
// 					borderRadius: 5,
// 					zIndex: 100,
// 					width: this.props.width, height: this.props.height
// 				}}>
// 					{this.props.children}
// 				</View>
// 			</View>
// 		)
// 	}
// }

class ModalComponent extends Component {
	constructor(props) {
		super(props);
	}

	renderItem(type) {
		switch(type) {
			case 'NewQuestion':
				return (
					<NewQuestionField closeModal = {this.props.closeModal} {...this.props} />
				)
			case 'InputNumber':
				return (
					<InputRangeField closeModal = {this.props.closeModal} {...this.props} />
				)
			case 'SearchFriend':
				return (
					<SearchFriend closeModal = {this.props.closeModal} openListModal = {this.props.openListModal} {...this.props}/>
				)
			case 'SearchFriendList':
				return (
					<SearchFriendList closeModal = {this.props.closeModal} friends = {this.props.friends}  {...this.props} />
				)
			case 'SelectAvatar':
				return (
					<SelectAvatar closeModal = {this.props.closeModal} onPressGalary = {this.props.onPressGalary} onPressCamera = {this.props.onPressCamera} />
				)
			case 'ChatInputAddition':
				return (
					<ChatInputAddition closeModal = {this.props.closeModal} addPhoto = {this.props.addPhoto} addVoice = {this.props.addVoice} addVideo = { this.props.addVideo } />
				)

			case 'PhotoPreview':
				return (
					<PhotoPreview closeModal = {this.props.closeModal} cancelUploadPhoto = {this.props.cancelUploadPhoto} uploadPhoto = {this.props.uploadPhoto} image = {this.props.image} />
				)
			case 'PhotoView':
				return (
					<PhotoView closeModal = {this.props.closeModal} image = {this.props.image}/>
				)
			case 'RecordVoice':
				return (
					<RecordVoice 
						closeModal = {this.props.closeModal} 
						startRecord = {this.props.startRecord} 
						stopRecord = {this.props.stopRecord} 
						status = {this.props.status}
						time = { this.props.time } 
					/>
				)
			case 'MessageModal':
				return (
					<MessageModal closeModal = {this.props.closeModal} title = {this.props.msgTitle} btnTitle = {this.props.btnTitle} />
				)
			case 'AudioModal':
				return (
					<AudioModal path = {this.props.path} />
				)
			default:
				return (
					<View></View>
				)		
		}
	}

	addQuestion(question) {
		this.props.addNewQuestion(question);
	}

	getErrors(errors) {
		this.props.getErrors(errors);
	}

	render() {
		return (
			<View >
				<Modal isVisible={this.props.isVisible} 
					// swipeDirection = "left" 
					style = {{alignSelf:'center'}}
					// onSwipeCancel = {() => {
					// 	this.props.closeModal();
					// }}
				>
					<View style = {{marginTop:50, marginBottom:50, alignItems:'center'}}>
						<View style={{flexDirection:'column', backgroundColor:'rgba(255,255,255,0.8)' ,borderRadius:10}}>
							<View style = {{flexDirection:'row'}}>
								<View style = {{flex:4,  padding:5,  justifyContent:'center'}}>
									<Text style = {styles.title}>{this.props.title}</Text>
								</View>
								<View style = {{flex:1, padding:5, alignItems:'flex-end', justifyContent:'center'}}>
									<TouchableOpacity onPress = {this.props.closeModal}>
										<Image source = {require('../../commonUI/icon/cross.png')} style = {{width:20*em, height:20*em, resizeMode:'cover' }} />
									</TouchableOpacity>
								</View>
							</View>
							{this.renderItem(this.props.contentType)}
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

class NewQuestionField extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			question:'',
			answer: 'No solution proposed.'
		}
		// var string = "";
		// Object.keys(this.props).map(item => string += item+'_');
		// Alert.alert(string);
	}

	onChangeText(field, value) {
		this.setState({[field]: value});
	}

	addQuestion() {
		// console.log(question);
		axios.post(SERVER_URL + '/main/quesandans', this.state)
		.then(res => this.props.addNewQuestion(res.data))
		.catch(err => this.props.getErrors(err.response.data));
		this.props.closeModal();
	}

    render() {
        return (
            <View style = {{flexDirection:'column', borderRadius:10, padding:5, width:400*em}}>
                <InputMultipleTextFormWithTitle 
					style = {styles.QuestionModal} 
					field = 'question' 
					onChangeText = {this.onChangeText.bind(this)}
					/>
                <NormalTextButton onPress = {this.addQuestion.bind(this)} style = {{height:50*em, backgroundColor:'#0066ff'}} title = "Add Question" />
                
            </View>
        )
    }
}

class InputRangeField extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			page_number:''
		}
		// var string = "";
		// Object.keys(this.props).map(item => string += item+'_');
		// Alert.alert(string);
	}

	onChangeText(field, value) {
		this.setState({[field]: value});
	}

	getArticles() {
		if( Number(this.state.page_number) > this.props.max_page_number || Number(this.state.page_number) < 0 ) {
			Alert.alert('Whoops', 'Input correct number.');
		} else {
			if(this.state.page_number < 1) {
				this.props.getArticles(parseInt(Number(this.state.page_number)) + 1);
			} else {
				this.props.getArticles(parseInt(Number(this.state.page_number)));
			}
			this.props.closeModal();
		}
	}

    render() {
        return (
            <View style = {{flexDirection:'column', borderRadius:10, padding:5}}>
                <InputSingleTextFormWithTitle 
					style = {styles.QuestionModal} 
					field = 'page_number' 
					onChangeText = {this.onChangeText.bind(this)}
					/>
                <NormalTextButton onPress = {this.getArticles.bind(this)} style = {{height:50*em, backgroundColor:'#0066ff'}} title = "Go" />
                
            </View>
        )
    }
}

const FriendDetail = ({friend, ...props}) => {
    return (
        <View style = {{flexDirection:'row', borderBottomWidth:1, borderColor:"#ccc", alignItems:'center', margin:0, padding:10}}>
            <View style = {{width:150*em, margin:5, justifyContent:'center'}}>
                <Text style = {{fontSize:20*em, textAlign:'center'}}>
                    {friend.name}
                </Text>
            </View>
            <View style = {{width: 150*em, margin:5, justifyContent:'center'}}>
                <Text style = {{fontSize:20*em, textAlign:'center'}}>
                    {friend.handle}
                </Text>
            </View>
            <View style = {{width: 25*em, margin:5, justifyContent:'center'}}>
                    {friend.gender == 'male'? (
                        <FIcon name = "male" size = {25} color = 'black' />
                    ) : (
                        <FIcon name = "female" size = {25} color = 'black' />
                    )}
            </View>
            <View style = {{justifyContent:'center'}}>
                <FIcon.Button name = "user-plus" size = {20} color = "white" backgroundColor="#3b5998" onPress = {() => {
                    axios.post(SERVER_URL + '/main/discuss/invite', friend) 
                    .then(res => props.inviteFriend(res.data))
                    .catch(err => props.getErrors(err.response.data))
                }}>
                </FIcon.Button>
            </View>
        </View>
    )
}
const SearchFriendList = ({friends, ...props}) => {
	_renderItem = ({item, index}) => {
		return (
			<FriendDetail friend = {item} {...props}/>
		)	
	}
	
	return (
		<View style = {{alignSelf:'center', flexDirection:'column', marginBottom:20, borderBottomWidth:4, borderColor:"#ccc"}}>
			{friends.length == 0 ? (
				<View style = {{justifyContent:'center'}}>
					<Text style = {{textAlign:'center', paddingTop:100, paddingBottom:100}}>
						There are no such friends.
					</Text>
				</View>
			) : (
				<ScrollView>    
					<FlatList 
						data = {friends} 
						keyExtractor={(item) => item._id} 
						renderItem={_renderItem} 
						vertical={true} />
				</ScrollView>
			)}
			
		</View>
	)
}
const SearchFriend = ({closeModal, openListModal, ...props}) => {
	const [todoState, setTodoState] = useState({
		name:'',
		handle:'',
		gender:'',
		birthday:'',
		phone_number:'',
		isMale: true,
		isFemale: true
	});

	const onChangeTextField = (field, value) => {
		setTodoState({...todoState, [field]: value});
	}

	const changeGender = (field) => {
		if(field == 'Male') {
			setTodoState({...todoState, isMale:!todoState.isMale});
		} else {
			setTodoState({...todoState, isFemale: !todoState.isFemale});
		}
	}

	const search = () => {
		if(todoState.isMale && !todoState.isFemale) {
			setTodoState({...todoState, gender:'male'});
		} 

		if(todoState.isFemale && !todoState.isMale) {
			setTodoState({...todoState, gender:'female'})
		}
		closeModal();
        props.setSearchLoading();
        axios.post(SERVER_URL+ '/main/discuss/search', todoState)
        .then(res => props.searchFriends(res.data))
		.catch(err => props.searchFriends([]));
		openListModal();
	}
	return (
		<View style = {{alignSelf:'center', flexDirection:'column', marginBottom:20, borderBottomWidth:4, borderColor:"#ccc"}}>
			<InputSingleTextFormWithTitle 
				title = 'Name'
				placeholder = "Input your friend's name."
				placeholderTextColor = "grey"
				onChangeText = {onChangeTextField.bind(this)}
				fontColor = "black"
				isSecure = {false}
				field = "name" 
				value = {todoState.name}
			/>

			<InputSingleTextFormWithTitle 
				title = 'Handle'
				placeholder = "Input your friend's handle."
				placeholderTextColor = "grey"
				onChangeText = {onChangeTextField.bind(this)}
				fontColor = "black"
				isSecure = {false}
				field = "handle"
				value = {todoState.handle}
			/>

			<View style = {{flexDirection:'row', marginBottom:20}}>
			
				<Text style = {{fontSize: 20*em, margin:20*em, width:120*em}}>Gender</Text>
				<CheckField active = {true} label = "Male" onChange = {() => {
					changeGender('Male');
				}} checked = {todoState.isMale} textStyle = {{marginTop:20*em, marginBottom:20*em}} imageStyle = {{marginTop:20*em}} />
				<CheckField active = {true} label = "Female" onChange = {() => {
					changeGender('Female');
				}} checked = {todoState.isFemale} textStyle = {{marginTop:20*em, marginBottom:20*em}} imageStyle = {{marginTop:20*em}} />
			</View>

			

			<InputSingleTextFormWithTitle 
				title = 'Birthday'
				placeholder = "1999-9-9, 1999-9, 1999"
				placeholderTextColor = "grey"
				onChangeText = {onChangeTextField.bind(this)}
				fontColor = "black"
				isSecure = {true}
				field = "birthday"
				value = {todoState.birthday}
			/>
			<View style = {{width:300*em, alignSelf :"center", marginBottom:10}}>
				<Icon.Button name="search" backgroundColor="#3b5998" style = {{alignSelf:'center'}} onPress={search}>
					Search your friends.
				</Icon.Button>
			</View>
		</View>
	)
}

const SelectAvatar = ({onPressGalary, onPressCamera, ...props}) => {
	return (
		<View style = {{borderTopWidth:1, height:100*em, flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
			{/* <View style = {{flexDirection:'row'}}> */}
				<TouchableOpacity onPress = {onPressCamera}>
					<View style = {{flex:1, justifyContent:'center', borderRightWidth:1}}>
						<Text style = {{padding:10, fontSize:30*em, textAlign:'center', justifyContent:'center'}}>
							Camera <FIcon name = 'camera' size = {30*em} color = '#006688' />
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress = {onPressGalary}>
					<View style = {{flex:1, justifyContent:'center', borderLeftWidth:1}}>
						<Text style = {{padding:10, fontSize:30*em, textAlign:'center', justifyContent:'center'}}>
							Gallery <FIcon name = 'photo' size = {30*em} color = '#006688' />
						</Text>
					</View>
				</TouchableOpacity>
			{/* </View> */}
		</View>
	)
}

const ChatInputAddition = ({addPhoto, addVideo, addVoice, ...props}) => {
	return (
		<View style = {{flexDirection:'column'}}>
			<View style = {{height:100*em, flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
					<TouchableOpacity onPress = {addVideo}>
						<View style = {{flex:1, justifyContent:'center'}}>
							<Text style = {{padding:10, fontSize:30*em, textAlign:'center', justifyContent:'center'}}>
								Video <FIcon name = 'film' size = {30*em} color = '#006688' />
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress = {addPhoto}>
						<View style = {{flex:1, justifyContent:'center'}}>
							<Text style = {{padding:10, fontSize:30*em, textAlign:'center', justifyContent:'center'}}>
								Photo <FIcon name = 'photo' size = {30*em} color = '#006688' />
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress = {addVoice}>
						<View style = {{flex:1, justifyContent:'center'}}>
							<Text style = {{padding:10, fontSize:30*em, textAlign:'center', justifyContent:'center'}}>
								Voice <FIcon name = 'microphone' size = {30*em} color = '#006688' />
							</Text>
						</View>
					</TouchableOpacity>
			</View>
			{/* <View style = {{height:100*em, flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
				<TouchableOpacity onPress = {takeVideo}>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{padding:10, fontSize:15*em, textAlign:'center', justifyContent:'center'}}>
							Record Video <FIcon name = 'video-camera' size = {15*em} color = '#006688' />
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress = {takePhoto}>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{padding:10, fontSize:15*em, textAlign:'center', justifyContent:'center'}}>
							Take Photo <FIcon name = 'camera' size = {15*em} color = '#006688' />
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress = {recordVoice}>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{padding:10, fontSize:15*em, textAlign:'center', justifyContent:'center'}}>
							Record <FIcon name = 'microphone' size = {15*em} color = '#006688' />
						</Text>
					</View>
				</TouchableOpacity>
			</View> */}
		</View>
	)
}

const PhotoPreview = ({image, cancelUploadPhoto, uploadPhoto, ...props}) => {

	return(
		<View style = {{flexDirection:'column'}}>
			<View style = {{width:600*em, height:800*em, flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
				<Image source = {{uri:`data:${image.mime};base64,${image.data}`}} style = {{width:'100%', height:'100%', resizeMode:'contain'}}/>
			</View>
			<View style = {{borderTopWidth:1,  flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
				
				<View style = {{flex:1, justifyContent:'center', alignSelf:'center', borderRightWidth:1}}>
					<TouchableOpacity onPress = {cancelUploadPhoto}>
						<Text style = {{padding:10, fontSize:25*em, textAlign:'center', justifyContent:'center'}}>
							Cancel 
						</Text>
					</TouchableOpacity>
				</View>
				
				
				<View style = {{flex:1, justifyContent:'center', alignSelf:'center', borderLeftWidth:1}}>
					<TouchableOpacity onPress = {uploadPhoto}>
						<Text style = {{padding:10, fontSize:25*em, textAlign:'center', justifyContent:'center'}}>
							Upload
						</Text>
					</TouchableOpacity>
				</View>
				
			</View>
		</View>
	)
}

const PhotoView = ({image, ...props}) => {
	return (
		<View style = {{width:600*em, height:800*em, flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
			<Image source = {{uri:image}} style = {{width:'100%', height:'100%', resizeMode:'contain'}}/>
		</View>
	)
}

const RecordVoice = ({startRecord, stopRecord, status}) => {

	const [ time, setTime ] = useState(0);
	var interval;

	const onPressStart = () => {
		startRecord();
		interval = setInterval(() => {
			setTime( time + 1 );
		}, 1000)
	}

	const onPressStop = () => {
		stopRecord();
		clearInterval(interval);
	}
	
	return (
		<View style = {{flexDirection:'column'}}>
			<View style = {{width:300*em, height:100*em, justifyContent:'center', flexDirection:'row', borderRadius:10,  backgroundColor:'rgba(255, 255, 255, 0.6)'}}>
				{/* <Text style = {{ paddingTop: 20, paddingBottom: 20, textAlign:'center', alignSelf:'center' ,fontSize:40*em}}>
					{ status && "Recording..."}
				</Text> */}
				{/* <Text style = {{ paddingTop: 20, paddingBottom: 20, textAlign:'center', alignSelf:'center' ,fontSize:40*em}}>
					{ `${String(parseInt(time/60))} : ${String(time%60)}` }
				</Text> */}
				{ status && <AudioRecordingStatusBar /> }
			</View>
			<View style = {{borderTopWidth:1,  flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
				
				<View style = {{flex:1, justifyContent:'center', alignSelf:'center', borderRightWidth:1}}>
					<TouchableOpacity onPress = { onPressStart } disabled = { status } >
						<Text style = {{padding:10, fontSize:40*em, textAlign:'center', justifyContent:'center'}}>
							<FIcon name = "play" size = { 25*em } color = { status ? "#FFFFFF" : "#00FF55"}/>
						</Text>
					</TouchableOpacity>
				</View>

				<View style = {{flex:1, justifyContent:'center', alignSelf:'center', borderLeftWidth:1}}>
					<TouchableOpacity onPress = { onPressStop } disabled = { !status } >
						<Text style = {{padding:10, fontSize:25*em, textAlign:'center', justifyContent:'center'}}>
							<FIcon name = "stop" size = { 25*em } color = { status ? "#FF0022": "#FFFFFF" }/>	
						</Text>
					</TouchableOpacity>
				</View>
				
			</View>
		</View>
	)
}

const AudioModal = ({ path }) => {

	const [ status, setStatus ] = useState(false);
	const [ playing, setPlaying ] = useState(false);
	const [ width, setWidth ] = useState(0);
	// var audio;
	useEffect(() => {
		// Alert.alert("sdf", path);
		this.interval = setInterval(() => {
			if(this.audio) {
				this.audio.getCurrentTime((time) => {
					setWidth( 300*em*time/(this.audio.getDuration()))
				})
			}
			
		}, 10)
		Sound.setCategory('Playback');
		return () => {
			clearInterval(interval);
			if (this.audio.isLoaded()) {
				setWidth(0);
				this.audio.stop();
			}
		}
	},[])

	const playAudio = () => {
		
		
		this.audio = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
			if (error) {
				Alert.alert('Whoops', 'failed to load the sound');
				return;
			}
			// loaded successfully
			// console.log('duration in seconds: ' + audio.getDuration() + 'number of channels: ' + audio.getNumberOfChannels());
			setStatus(true);
			setPlaying(true);
			// Play the sound with an onEnd callback
			audio.play((success) => {
				if (success) {
					setStatus(false); //This is called when finish
				} else {
					Alert.alert('Whoops', 'failed to load the sound');
				}
			});
		});
	}

	const pauseAudio = () => {
		this.audio.pause(() => {
			setPlaying(false);
		});
	}

	const resumeAudio = () => {
		setPlaying(true);
		this.audio.play();
		// this.audio.setCurrentTime(this.audio.getCurrentTime());
	}

	const stopAudio = () => {
		this.audio.setCurrentTime(0);
		this.audio.stop(() => {
			setStatus(false);
			setPlaying(false);
		});
	}

	const goForward = () => {
		this.audio.getCurrentTime((time) => {
			if( time + 3 >= this.audio.getDuration()) {
				stopAudio();
				// this.audio.setCurrentTime(this.audio.getDuration());
			} else {
				this.audio.setCurrentTime(time + 3);
			}
		})
		
	}

	const goBackward = () => {
		this.audio.getCurrentTime((time) => {
			if( time - 3 >= 0) {
				
				this.audio.setCurrentTime(time - 3);
				// this.audio.setCurrentTime(this.audio.getDuration());
			} else {
				this.audio.stop(() => {
					this.audio.play()
				})
			}
		})
	}

	return (
		<View style = {{flexDirection:'column', width: 300*em}}>
			<View style = {{ height:20*em, width: width, backgroundColor:'black' }}>

			</View>
			<View style = {{height:100*em, flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)', justifyContent:'center'}}>
				<TouchableOpacity onPress = { status ? ( playing ? pauseAudio : resumeAudio ) : playAudio }>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{ padding:10, fontSize:30*em, textAlign:'center' }}>
							<MIcon name = { playing ? 'pause' : 'play' } size = {30*em} color = '#00FF66' />
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress = { goBackward } disabled = { !status }>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{padding:10, fontSize:30*em, textAlign:'center'}}>
							<MIcon name = 'arrow-left-box' size = {30*em} color = { status ? '#0044FF' : '#000000'} />
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress = { goForward } disabled = { !status }>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{padding:10, fontSize:30*em, textAlign:'center'}}>
							<MIcon name = 'arrow-right-box' size = {30*em} color = { status ? '#0044FF' : '#000000'} />
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress = { stopAudio } disabled = { !status }>
					<View style = {{flex:1, justifyContent:'center'}}>
						<Text style = {{padding:10, fontSize:30*em, textAlign:'center'}}>
							<MIcon name = 'stop' size = {30*em} color = { status ? '#FF6644' : '#000000'} />
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

class AudioRecordingStatusBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 0*em,
			direction: true
		}
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			if( this.state.direction ) {
				if( this.state.height == 30*em) {
					this.setState({ direction: false });
					this.setState({height: 30*em});
				} else {
					this.setState({ height : this.state.height + 1*em });
				}
			} else {
				if( this.state.height == 0*em) {
					this.setState({ direction: true });
					this.setState({ height : 0*em });
				} else {
					this.setState({ height : this.state.height - 1*em });
				}
			}
			
		}, 10)
	}

	componentWillUnmount() {
		clearInterval( this.interval );
	}

	render() {
		return (
			<View style = {{flex:1, justifyContent:'center', flexDirection:'row', borderRadius:10,}}>
				<View style = {{ backgroundColor:'grey' }}>
					<View style = {{ width: 40*em, height: Math.ceil(Math.random()-0.5) == 0 ? 50*em+ Math.floor(Math.random() * 30)*em : 50*em- Math.floor(Math.random() * 30)*em, backgroundColor:'white', justifyContent:'flex-end' }}>

					</View>
				</View>
				<View style = {{ backgroundColor:'grey' }}>
					<View style = {{ width: 40*em, height:Math.ceil(Math.random()-0.5) == 0 ? 50*em+ Math.floor(Math.random() * 40)*em : 50*em- Math.floor(Math.random() * 40)*em, backgroundColor:'white', justifyContent:'flex-end' }}>

					</View>
				</View>
				<View style = {{ backgroundColor:'grey' }}>
					<View style = {{ width: 40*em, height:Math.ceil(Math.random()-0.5) == 0 ? 50*em- Math.floor(Math.random() * 10)*em : 50*em+ Math.floor(Math.random() * 10)*em, backgroundColor:'white', justifyContent:'flex-end' }}>

					</View>
				</View>
				<View style = {{ backgroundColor:'grey' }}>
					<View style = {{ width: 40*em, height:Math.ceil(Math.random()-0.5) == 0 ? 50*em- Math.floor(Math.random() * 20)*em : 50*em+ Math.floor(Math.random() * 20)*em, backgroundColor:'white', justifyContent:'flex-end' }}>

					</View>
				</View>
				<View style = {{ backgroundColor:'grey' }}>
					<View style = {{ width: 40*em, height:Math.ceil(Math.random()-0.5) == 0 ? 50*em+ Math.floor(Math.random() * 30)*em : 50*em- Math.floor(Math.random() * 30)*em, backgroundColor:'white', justifyContent:'flex-end' }}>

					</View>
				</View>
				
			</View>
		)
	}
}

// const AudioRecordingStatusBar = () => {

// 	const [ animatedHeight, setAnimatedHeight ] = useState( new Animated.Value(0) );

// 	useEffect(() => {
// 		Animated.sequence([
// 			Animated.spring(
// 				animatedHeight,
// 				{
// 					toValue: 30*em,
// 					friction: 1,
// 					tension: 1,
// 					duration: 1000
// 				}
// 			),
// 			Animated.spring(
// 				animatedHeight,
// 				{
// 					toValue: 0,
// 					friction: 1,
// 					tension: 1,
// 					duration: 1000
// 				}
// 			),
// 		]).start();
// 	},[])
	
// 	return (
// 		<View style = {{flex:1, justifyContent:'center', flexDirection:'row', borderRadius:10,  backgroundColor:'#rgba(255,255,255,0.6)'}}>
// 			<Animated.View style = {{ width: 50*em, height: 50*em + animatedHeight, backgroundColor:'grey' }}>

// 			</Animated.View>
// 			<Animated.View style = {{ width: 50*em, height: 70*em + animatedHeight, backgroundColor:'grey' }}>

// 			</Animated.View>
// 			<Animated.View style = {{ width: 50*em, height: 90*em - animatedHeight, backgroundColor:'grey' }}>

// 			</Animated.View>
// 			<Animated.View style = {{ width: 50*em, height: 50*em - animatedHeight, backgroundColor:'grey' }}>

// 			</Animated.View>
// 			<Animated.View style = {{ width: 50*em, height: 30*em + animatedHeight, backgroundColor:'grey' }}>

// 			</Animated.View>
			
// 		</View>
// 	)
// }

const MessageModal = ({title, btnTitle, closeModal, ...props}) => {
	return (
		<View style = {{flexDirection:'column', borderRadius:10, padding:5, width:400*em}}>
			<View style = {{ alignItems:'center' }} >
				<Text style = {{alignSelf:'center', textAlign:'center', justifyContent:'center', fontSize:25*em}}>
					{title}
				</Text>
			</View>
			<NormalTextButton onPress = {closeModal} style = {{height:50*em, backgroundColor:'#0066ff'}} title = {btnTitle} />
			
		</View>
	)
}


const mapStateToProps = (state) => ({
	ques: state.ques
})

const mapDispatchToProps = {
	getErrors: (errors) => getErrors(errors),
	addNewQuestion: (question) => addQuestion(question),
	setSearchLoading: () => setSearchLoading(),
	searchFriends: (friends) => searchFriends(friends),
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent);

const styles = StyleSheet.create({
	QuestionModal: {
		width:'100%', borderColor:'#000023', borderStyle:'dotted', borderWidth:2, borderRadius:10
	},
	title: {
		fontSize:20*em, color:'black'
	}
})