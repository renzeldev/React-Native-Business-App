import React, {Component} from 'react'
import {View, Text, TextInput, ScrollView, Image, Alert, Animated} from 'react-native'

import {em, H} from '../../../commonUI/base'
import {TopBar} from '../../../commonUI/components/topbar'
import {formStyles, actionButtonStyles} from '../../../commonUI/styles'
import {PrimaryButton, SecondaryButton, ImageButton} from '../../../commonUI/components/buttons'
import {InputField, InputSingleTextFormWithImage, InputSingleTextFormWithTitle, DateField, CheckField} from '../../../commonUI/components/inputs'
import {Actions} from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import {CheckBox} from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';



export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			side: 0,
			name:'',
			handle:'',
			password:'',
			password1:'',
			gender:'male',
			birthday:'2023-01-01',
			work:'',
			citizen_card:'',
			phone_number:'',
			checked:false,
			animatedHeight:new Animated.Value(0),
		}
	}

	goBack() {
		// this.props.navigation.goBack();
		Actions.pop();		
	}
	onSubmit() {
		this.props.navigation.navigate('signup-id_card_upload')
	}

	changeSide(value) {
		this.setState({side: value});
		Animated.sequence([
			Animated.timing(
				this.state.animatedHeight,
				{
					toValue: -100,
					duration: 100
				}
			),
			Animated.timing(
				this.state.animatedHeight,
				{
					toValue: 0,
					duration: 500
				}
			),
		]).start();
		
		// this.setState({animatedHeight: new Animated.Value(-800)});
	}

	componentDidMount() {
		// Alert.alert(new Date().getDate());
	}

	onChangeTextField(field, value) {
		// Alert.alert(field, value)
		this.setState({[field]:value});
	}
	render() {
		return (
			<View style = {{flex:1}}>
				<TopBar title='注册' onBack={this.goBack.bind(this)}/>
				<Animated.View style = {{flex:4, justifyContent:'center', alignItems:'center', transform:[{translateY:this.state.animatedHeight}]}}>
					
					{this.state.side == 0 ? (
						<FirstSignPage onChangeTextField = {this.onChangeTextField.bind(this)} state = {this.state} />
					) : (
						<SecondSignPage onChangeTextField = {this.onChangeTextField.bind(this)} state = {this.state} />
					)}
				</Animated.View>
				<View style = {{flex:1, flexDirection:'row', justifyContent:'center'}}>		
					<ImageButton ImageUrl = {require('../../../commonUI/image/left_arrow.png')}
						onPress = {() => {this.changeSide(0)}}
						disabled = {this.state.side == 0 ? (true) : (false)}
					/>
					<ImageButton ImageUrl = {require('../../../commonUI/image/right_arrow.png')}
						onPress = {() => {this.changeSide(1)}}
						disabled = {this.state.side == 1 ? (true):(false)}
					/>
				</View>
				{/* <Form onSubmit={this.onSubmit.bind(this)}/> */}
			</View>
		)
	}
}

class FirstSignPage extends Component {

	onChangeTextField(field, value) {
		//   Alert.alert(field, value);
		this.props.onChangeTextField(field, value);
		// this.setState({[field]:value});
	}
	render() {
		const {state} = this.props
		return (
			<View>
				<InputSingleTextFormWithTitle 
					title = 'Name'
					placeholder = "Input your name."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "name" 
					value = {state.name}
				/>

				{/* <CheckBox title = 'gender'  /> */}
				{/* <Icon name="rocket" size={30} color="#900" /> */}
				{/* <CheckField label = "Gender" onChange = {() => {}} checked = {state.checked} */}

				<InputSingleTextFormWithTitle 
					title = 'Handle'
					placeholder = "Input your handle."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "handle"
					value = {state.handle}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Password'
					placeholder = "Input your password."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {true}
					field = "password"
					value = {state.password}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Confirm'
					placeholder = "Confirm your password."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {true}
					field = "password1"
					value = {state.password1}
				/>
			</View>
		)
	}
}

class SecondSignPage extends Component {

	onChangeTextField(field, value) {
		//   Alert.alert(field, value);
		this.props.onChangeTextField(field, value);
		// this.setState({[field]:value});
	}

	onDateChangeField(field, value) {
		this.props.onChangeTextField(field, value);
	}
	render() {
		const {state} = this.props;
		return (
			<View>
				{/* <InputSingleTextFormWithTitle 
					title = 'Birthday'
					placeholder = "Input your birthday."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "birthday"
					value = {state.birthday}
				/> */}

				{/* <DatePicker/> */}
				{/* <DateField /> */}
				<DateField title = "Birthday" value = {state.birthday} name = 'birthday' placeholder = "Input your birthday" onChangeField = {this.onDateChangeField.bind(this)} />
				<InputSingleTextFormWithTitle 
					title = 'Job'
					placeholder = "Input your job."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "work"
					value = {state.work}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Certificate'
					placeholder = "Input your citizen card."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {true}
					field = "citizen_card"
					value = {state.citizen_card}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Phone'
					placeholder = "Input your phone number."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {true}
					field = "phone_number"
					value = {state.phone_number}
				/>
			</View>
		)
	}
}

class Form extends Component {
	constructor() {
		super();
		this.state = {
			formData: {
				user_phone: '',
				verify_code: ''
			}
		}
	}
	onChangeField(fieldName, fieldValue) {
		let {formData} = this.state;
		formData[fieldName] = fieldValue;
		this.setState({
			...this.state,
			formData: formData
		})
	}
	sendSubmit() {
		this.props.onSubmit();
	}
	render() {
		return (
			<View>
				<ScrollView style={formStyles.formWrapper}>
					<View style={formStyles.formInnerWrapper}>
						<InputField label='手机号' placeholder='请输入' name='user_phone' onChangeField={this.onChangeField.bind(this)} />
						<View style={{position: 'relative'}}>
							<InputField label='验证码' placeholder='输入验证码' name='verify_code' onChangeField={this.onChangeField.bind(this)} />
							<View style={{position: 'absolute', right: 0, top: 12*em}}>
								<SecondaryButton title='发送验证码' onPress={this.props.onPress}/>	
							</View>
						</View>
					</View>
				</ScrollView>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}