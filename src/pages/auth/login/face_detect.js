import React, {Component} from 'react'
import {View,Text, Image} from 'react-native'

import {TopBar} from '../../../commonUI/components/topbar'
import {W, em} from '../../../commonUI/base'
import {textStyles} from '../../../commonUI/styles'

import bgImage from '../../../commonUI/images/内页_头部背景.png'
import bgImage2 from '../../../commonUI/images/注册_图标_返回.png'


export default class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		},
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

  render() {
		return (
			<View>
				<TopBar title='人脸识别验证' onBack={this.goBack.bind(this)}/>
				{this.state.detectResult=='until'?
					<DetectBefore/>
				:this.state.detectResult=='successful'?
					<DetectSuccess/>:
					<DetectFailure/>}
			</View>
		)
	}
}



class DetectBefore extends Component {
	render() {
		return (
			<View style={{
				paddingTop: em*240, 
				alignItems: 'center'
			}}>
				<Text style={textStyles.default}>请将脸部...</Text>
				<Image source={require('../../../commonUI/images/注册_图片_人像.png')}
				style={{width: em*454, height: em*532}}/>
			</View>
		)
	}
}

class DetectSuccess extends Component {
	render() {
		return (
			<View>
				successful
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