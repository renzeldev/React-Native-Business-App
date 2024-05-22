import React, {Component} from 'react'
import {View, Text, TextInput, ScrollView, Image} from 'react-native'
import DatePicker from 'react-native-datepicker'

import {em, W, H, colors, fontSizes} from '../../../commonUI/base'
import {textStyles, formStyles, actionButtonStyles} from '../../../commonUI/styles'
import {TopBar} from '../../../commonUI/components/topbar'
import {PrimaryButton} from '../../../commonUI/components/buttons'
import {InputField, SelectField, DateField, DateBetweenField} from '../../../commonUI/components/inputs'
import {nationality_dropdowns} from "../../../config"

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
			<View style={{
			}}>
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
			user_certno: '',
			user_sex: '',
			user_nation: '请选择',
			birthday: '',
			user_address: '',
			published_agency: '',
			able_tween_from: '',
			able_tween_to: ''
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
		this.props.navigation.navigate('signup-photo_upload')
	}
	render() {
		return (
			<View>
				<ScrollView style={formStyles.formWrapper}>
					<View style={formStyles.formInnerWrapper}>
						<InputField label='姓名' name='user_name' placeholder='请输入' onChangeField={this.onChangeField.bind(this)}/>
						<InputField label='身份证号' name='user_certno' placeholder='请输入' onChangeField={this.onChangeField.bind(this)}/>
						<InputField label='性别' name='user_sex' placeholder='自动带入' onChangeField={this.onChangeField.bind(this)}/>
						<SelectField label='民族' name='user_nation' placeholder='请选择' value={this.state.formData.user_nation} pickerName='请选择民族' data={nationality_dropdowns} onChangeField={this.onChangeField.bind(this)}/>
						<DateField label='生日' name='birthday' placeholder='自动带入' onChangeField={this.onChangeField.bind(this)} value={this.state.formData.birthday}/>
						<InputField label='地址' name='user_address' placeholder='请输入' onChangeField={this.onChangeField.bind(this)}/>
						<InputField label='签发机关' name='published_agency' placeholder='请输入' onChangeField={this.onChangeField.bind(this)}/>
						<DateBetweenField label='有效期限' fromName='able_tween_from' fromPlaceholder='起始日期' fromValue={this.state.formData.able_tween_from} toName='able_tween_to' toPlaceholder='结束日期' toValue={this.state.formData.able_tween_to} onChangeField={this.onChangeField.bind(this)}/>
					</View>
				</ScrollView>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.onSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}



