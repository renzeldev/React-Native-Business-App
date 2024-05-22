import React, {Component} from 'react'
import {View, Text, TextInput, ScrollView, Image} from 'react-native'

import {em, H, fontSizes, colors} from '../../../commonUI/base'
import {TopBar} from '../../../commonUI/components/topbar'
import {formStyles, textStyles, actionButtonStyles} from '../../../commonUI/styles'
import {PrimaryButton} from '../../../commonUI/components/buttons'

export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
	goBack() {
		this.props.navigation.goBack();		
	}
	onSubmit() {
		this.props.navigation.navigate('signup-input_personal_info')
	}
	render() {
		return (
			<View style={{backgroundColor: '#fff'}}>
				<TopBar title='注册' onBack={this.goBack.bind(this)}/>
				<Form onSubmit={this.onSubmit.bind(this)}/>
			</View>
		)
	}
}

class Form extends Component {
	constructor() {
		super();
		this.state = {
			formData: {
			}
		}
	}
	onSubmit() {
		this.props.onSubmit();
	}
	render() {
		return (
			<View>

				<View style={formStyles.formWithoutFieldsWrapper}>
					<Text style={[textStyles.default, {marginTop: 50*em, marginBottom: 50*em}]}>身份证采集</Text>
					<Image source={require('../../../commonUI/images/注册_图片_身份证正面采集.png')} style={{
						width: 480*em, height: 306*em
					}}/>
					<Text style={[textStyles.primary, {marginTop: 20*em, marginBottom: 40*em,}]}>
						拍摄身份证正面
					</Text>
					<Image source={require('../../../commonUI/images/注册_图片_身份证背面采集.png')} style={{
						width: 480*em, height: 306*em,
					}}/>
					<Text style={[textStyles.primary, {marginTop: 20*em, marginBottom: 40*em,}]}>
						拍摄身份证反面
					</Text>
				</View>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.onSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}