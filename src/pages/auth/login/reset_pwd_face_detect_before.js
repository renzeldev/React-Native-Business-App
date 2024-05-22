import React, {Component} from 'react'
import {ScrollView, View, Text, TextInput} from 'react-native'

import {W, H, em, colors, fontSize} from '../../../commonUI/base'
import {PrimaryButton} from '../../../commonUI/components/buttons'
import {TopBar} from '../../../commonUI/components/topbar'
import {actionButtonStyles, formStyles} from '../../../commonUI/styles'
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
				<TopBar title='找回密码' onBack={this.goBack.bind(this)}/>
				<Form navigation={this.props.navigation}/>
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
		this.props.navigation.navigate('login-reset_pwd_face_detect')
	}
	render() {
		return (
			<View>
				<ScrollView style={formStyles.formWrapper}>
					<View style={formStyles.formInnerWrapper}>
						<InputField label='账号' placeholder='请输入' name='user_loginid' onChangeField={this.onChangeField.bind(this)} />						
					</View>
				</ScrollView>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}