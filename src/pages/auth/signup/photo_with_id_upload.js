import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'

import {TopBar} from '../../../commonUI/components/topbar'
import {em, H, colors} from '../../../commonUI/base'
import {actionButtonStyles, textStyles, formStyles} from '../../../commonUI/styles'
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
  render() {
		return (
			<View style={{backgroundColor: '#fff'}}>
				<TopBar title='注册' onBack={this.goBack.bind(this)}/>
				<PhotoForm navigation={this.props.navigation}/>
			</View>
		)
	}
}

class PhotoForm extends Component {
	sendSubmit() {
		this.props.navigation.navigate('signup-user_set');
	}
	render() {
		return (
			<View style={formStyles.formWithoutFieldsWrapper}>
				<View>
					<Text style={{marginTop: 60*em, marginBottom: 50*em}}>
						人证照片采集
					</Text>
				</View>
				<View style={{alignItems: 'center'}}>
					<Image source={require('../../../commonUI/images/注册_图片_手持身份证采集.png')} style={{width: 450*em, height: 540*em}}/>
				</View>
				<View style={{
					marginTop: 20*em
				}}>
					<Text style={textStyles.primary}>
						手持身份证拍摄
					</Text>
				</View>
				<View style={{
					width: 440*em,
					marginTop: 30*em
				}}>
					<Text style={textStyles.small}>请确保：</Text>
					<Text style={textStyles.small}>1.身份证上的所有信息清晰可见</Text>
					<Text style={textStyles.small}>2.手持证件人需免冠，五官清晰，建议未化妆</Text>
					<Text style={textStyles.small}>3.照片内容真实有效，不得做任何修改</Text>
				</View>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}