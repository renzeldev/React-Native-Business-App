import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'

import {em} from '../../../commonUI/base'
import {TopBar} from '../../../commonUI/components/topbar'
import {textStyles} from '../../../commonUI/styles'

export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
	constructor() {
		super()
		this.state = {
			detectResult: 'until'
		};
	}
	goBack() {
		this.props.navigation.goBack();
	}
	onSuccess() {
		this.setState({
			...this.state, 
			detectResult: 'successful'
		})
	}
	onAfterSuccess() {
		this.props.navigation.navigate('login-reset_pwd_set_pwd_after_face_detect')
	}
	render() {
		return (
			<View>
				<TopBar title='人脸识别验证' actionBtnTitle='成功' actionBtn={this.onAfterSuccess.bind(this)} onBack={this.goBack.bind(this)}/>
				{this.state.detectResult=='until'
					? <DetectBefore onSuccess={this.onSuccess.bind(this)}/>
					: this.state.detectResult=='successful'
						? <DetectSuccess onAfterSuccess={this.onAfterSuccess.bind(this)}/>
						:	<DetectFailure/>}
			</View>
		)
	}
}

class DetectBefore extends Component {
	detectFace() {
		this.props.onSuccess();
	}
	render() {
		return (
			<View style={{
				paddingTop: em*240, 
				alignItems: 'center'
			}}>
				<Text onPress={this.detectFace.bind(this)}>请将脸部...</Text>
				<Image source={require('../../../commonUI/images/注册_图片_人像.png')}
				style={{width: em*454, height: em*532}}/>
			</View>
		)
	}
}

class DetectSuccess extends Component {
	render() {
		return (
			<View style={{
				paddingTop: em*240, 
				alignItems: 'center'
			}}>
				<Text style={textStyles.default} onPress={this.props.onAfterSuccess}>验证成功</Text>
				<Image source={require('../../../commonUI/images/注册_图片_人像.png')}
				style={{width: em*454, height: em*532}}/>
				<Image source={require('../../../commonUI/images/登录_图标_识别成功.png')} style={{
					width: em*80, height: em*80,
					marginTop: -em*40,
				}}/>
			</View>
		)
	}
}

class DetectFailure extends Component {
	render() {
		return (
			<View>
				failure
			</View>
		)
	}
}