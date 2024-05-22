import React, {Component} from 'react'
import {ScrollView, View, Text, TextInput, Image, Alert} from 'react-native'

import {TopBar} from '../../../commonUI/components/topbar'
import {PrimaryButton} from '../../../commonUI/components/buttons'
import {actionButtonStyles, formStyles, textStyles} from '../../../commonUI/styles'
import {em, H, colors,} from '../../../commonUI/base'
// import {Modal} from '../../../commonUI/components/modal'
import Modal from 'react-native-modal'
import {InputField} from '../../../commonUI/components/inputs'

export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
	constructor(props) {
		super(props)
		this.state = {
			result: 'until'
		}
	}
	goBack() {
		this.props.navigation.goBack();
	}
	onSuccess() {
		Alert.alert('密码修改成功');
		/*
		this.setState({
			...this.state,
			result: 'success'
		})
		*/
	}
	onCloseModal() {
		this.setState({
			...this.state,
			result: 'until'
		})
	}
	render() {
		return (
			<View>
				<TopBar title='重设密码' onBack={this.goBack.bind(this)}/>
				<Form onSuccess={this.onSuccess.bind(this)}/>
				{/*
				<TouchableOpacity onPress={showAlert} style={} isVisible={this.state.result=='success'}>
					<Text>Alert</Text>
				</TouchableOpacity>
				<Modal isVisible={this.state.result=='success'}>
					<ModalContent/>
				</Modal>
				*/}
			</View>
		)
	}
}

class Form extends Component {
	constructor() {
		super();
		this.state = {
			formData: {
				user_loginid: ''
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
		this.props.onSuccess();
	}
	render() {
		return (
			<View>
				<ScrollView style={formStyles.formWrapper}>
					<View style={formStyles.formInnerWrapper}>
						<InputField label='新密码' placeholder='请输入' name='user_loginpwd' onChangeField={this.onChangeField.bind(this)} />
						<InputField label='确认密码' placeholder='请再次输入密码' name='confirm_pwd' onChangeField={this.onChangeField.bind(this)} />
						{/*<Text style={[textStyles.small, {marginTop: 20*em}]}>密码为6位数字组合</Text>*/}
					</View>
				</ScrollView>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='确定' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}

class ModalContent extends Component {
	render() {
		return (
			<View style={{
				backgroundColor: '#fff', alignItems: 'center', alignSelf: 'center',
				width: 300*em, height: 280*em, 
				paddingTop: 60*em, paddingBottom: 60*em, paddingLeft: 40*em, paddingRight: 40*em,
				borderRadius: 5}}>
				<Image source={require('../../../commonUI/images/登录_图标_识别成功.png')} style={{
					width: em*100, height: em*100
				}}/>
				<Text onPress={this.props.onCloseModal} style={[textStyles.primary, {marginTop: em*36
				}]}>
					密码重设成功
				</Text>
			</View>
		)
	}
}
