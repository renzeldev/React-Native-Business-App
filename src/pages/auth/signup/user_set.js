import React, {Component} from 'react'
import {View, Text, TextInput} from 'react-native'

import {TopBar} from '../../../commonUI/components/topbar'
import {em, H} from '../../../commonUI/base'
import {formStyles, actionButtonStyles, textStyles} from '../../../commonUI/styles'
import {PrimaryButton} from '../../../commonUI/components/buttons'
import {InputField} from '../../../commonUI/components/inputs'

export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
	goBack() {
		this.props.navigation.goBack();		
	}
  render() {
		return (
			<View>
				<TopBar title='注册' onBack={this.goBack.bind(this)}/>
				<Form navigation={this.props.navigation}/>
			</View>
		)
	}
}

class Form extends Component {
	constructor() {
		super();
		this.state = {formData: {
			user_name: '',
			user_loginpwd: '',
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
  onSubmit() {

	}
	render() {
		return (
			<View style={{height: H-90, marginTop: 10*em, backgroundColor: '#fff'}}>
				<View style={{
					
				}}>
					<View style={{marginLeft: em*20, width: em*680, }}>
						<InputField name='user_name' label='用户名' placeholder='请输入' onChangeField={this.onChangeField.bind(this)}/>
						<InputField name='user_loginpwd' label='登录密码' placeholder='请输入' onChangeField={this.onChangeField.bind(this)} passwordField/>
						<InputField name='confirm_pwd' label='确认密码' placeholder='请再次输入密码' onChangeField={this.onChangeField.bind(this)} passwordField/>
						<Text style={[textStyles.small, {
							marginTop: em*20,
						}]}>密码为6位数字组合</Text>
					</View>
				</View>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='确定' onPress={this.onSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}
