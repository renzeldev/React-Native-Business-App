import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'

import {TopBar} from '../../../commonUI/components/topbar'
import {em, H, colors, fontSize} from '../../../commonUI/base'
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
		this.props.navigation.navigate('signup-photo_with_id_upload');
	}
	render() {
		return (
			<View style={formStyles.formWithoutFieldsWrapper}>
				<View>
					<Text style={{marginTop: 90*em, marginBottom: 70*em}}>
						人像采集
					</Text>
				</View>
				<View style={{alignItems: 'center'}}>
					<Image source={require('../../../commonUI/images/注册_图片_人像采集.png')} style={{width: 450*em, height: 540*em}}/>
				</View>
				<View style={{
					width: 400*em,
					marginTop: 60*em
				}}>
					<Text style={textStyles.small}>请确保：</Text>
					<Text style={textStyles.small}>1.照片需免冠，五官清晰，建议未化妆</Text>
					<Text style={textStyles.small}>2.照片内容真实有效，不得做任何修改</Text>
				</View>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}