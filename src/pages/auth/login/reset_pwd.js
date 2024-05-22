import React, {Component} from 'react'
import {ScrollView, View, Text, TextInput} from 'react-native'

import {TopBar} from '../../../commonUI/components/topbar'
import {W, H, em, colors, fontSizes} from '../../../commonUI/base'
import {SecondaryButton, PrimaryButton} from '../../../commonUI/components/buttons'
import {textStyles, actionButtonStyles, formStyles} from '../../../commonUI/styles'
import {InputField} from '../../../commonUI/components/inputs'

export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
	constructor() {
		super()
	}
	goBack() {
		this.props.navigation.goBack();
	}
	goFaceDetect() {
		this.props.navigation.navigate('login-reset_pwd_face_detect_before')
	}
  render() {
		return (
			<View>
				<TopBar title='找回密码' actionBtnTitle='人脸识别找回' actionBtn={this.goFaceDetect.bind(this)} onBack={this.goBack.bind(this)}/>
				<Form/>
			</View>
		)
	}
}

class Form extends Component {
	constructor() {
		super();
		this.state = {formData: {
			user_phone: '',
			verify_code: '',
			new_pwd: '',
			confirm_pwd: ''
		}}
	}
	onChangeField(fieldName, fieldValue) {
		let {formData} = this.state;
		formData[fieldName] = fieldValue;
		this.setState({
			...this.state,
			formData: formData
		})
	}
	sendVerifyCode() {

	}
	sendSubmit() {

	}
	render() {
		return (
			<View>
				<ScrollView style={formStyles.formWrapper}>
					<View style={formStyles.formInnerWrapper}>
						<InputField label='手机号' name='user_phone' onChangeField={this.onChangeField.bind(this)} placeholder='请输入'/>
						<View style={{position: 'relative'}}>
							<InputField label='验证码' name='verify_code' onChangeField={this.onChangeField.bind(this)} placeholder='输入验证码' verifyCodeField onPress={this.sendVerifyCode.bind(this)}/>
							<View style={{position: 'absolute', right: 0, top: 15*em}}>
								<SecondaryButton title='发送验证码' onPress={this.sendVerifyCode.bind(this)}/>
							</View>
						</View>
						<InputField label='新密码' name='new_pwd' onChangeField={this.onChangeField.bind(this)} placeholder='请输入' passwordField/>
						<InputField label='密码确认' fieldName='confirm_pwd' onChangeField={this.onChangeField.bind(this)} placeholder='请再次输入新密码' passwordField/>
						<Text style={[textStyles.small, {marginTop: 20*em}]}>密码为6位数字组合</Text>
					</View>
				</ScrollView>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='确定' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}
