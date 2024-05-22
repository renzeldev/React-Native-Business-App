import React, {Component} from 'react'
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native'

import {W, colors, fontSize} from '../base'

export class TopBar extends Component {
	onBack() {
		this.props.onBack();
	}
	render() {
		return (
			<View>
				<ImageBackground source={require('../images/内页_头部背景.png')} 
				style={{
					width: '100%', height: W*96/720,
					position: 'relative', justifyContent: 'center'
				}}>
					<View style={{
						position: 'absolute', left: W*21/720, top: W*30/960,
						alignSelf: 'center'
					}}>
						<TouchableOpacity onPress={this.onBack.bind(this)}>
							<Image source={require('../images/注册_图标_返回.png')} style={{
								width: W*22/720, height: W*40/720
							}}/>
						</TouchableOpacity>
					</View>
					<View style={{
						position: 'absolute', left: 0, top: W*24/960,
						width: '100%',
						justifyContent: 'center', alignItems: 'center'
					}}>
						<Text style={{
							color: colors.primaryForeground,
							fontSize: W*0.05,
						}}>{this.props.title}</Text>
					</View>
					{this.renderActionBtn()}
				</ImageBackground>
			</View>
		)
	}
	renderActionBtn() {
		if (this.props.actionBtn) {
			return (
				<View style={{
					position: 'absolute', right: W*20/960, top: W*35/960,
					width: '100%',
					alignItems: 'flex-end'
				}}>
					<TouchableOpacity onPress={this.props.actionBtn}>
						<Text style={{
							color: colors.primaryForeground,
							fontSize: W*0.036
						}}>
							{this.props.actionBtnTitle}
						</Text>
					</TouchableOpacity>
				</View>
			)
		}
		
	}
}