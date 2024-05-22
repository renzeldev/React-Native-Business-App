import React, {Component} from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native'

import {W, em, colors, fontSizes} from '../base'
import {textStyles} from '../styles'

export class NormalTextButton extends Component {
	render() {
		return (
				<TouchableOpacity onPress={this.props.onPress} style={{}} disabled = {this.props.disabled}>
					<Text style = {[
										{ textAlign:'center', 
											margin:5, 
											padding:3, 
											color:'white', 
											borderWidth:1, 
											borderColor:'#ccc' ,
										},
										this.props.style
									]}>
						{this.props.title}
					</Text>
				</TouchableOpacity>
		)
	}
}

export class ImageButton extends Component {
	render() {
		return (
			<TouchableOpacity onPress={this.props.onPress} style={{}} disabled = {this.props.disabled} >
				<Image source = {this.props.ImageUrl} style = {[{justifyContent:'center', margin:10, opacity: this.props.disabled ? 0.2 : 1}, this.props.style]} />
			</TouchableOpacity>
		)
	}
}

export class TextButton extends Component {
	render() {
		return (
			<View style={{}}>
				<TouchableOpacity onPress={this.props.onPress} style={{
				}}>
					<Text style={textStyles.default}>
						{this.props.title}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

export class PrimaryButton extends Component {
	onPress() {
		if (this.props.disabled) {
			return
		}
		this.props.onPress()
	}
	render() {
		const {disabled} = this.props
		if (disabled) {
			return (
				<View>			
					<View style={{
						width: '100%', height: em*81,
						backgroundColor: colors.primaryBackground, 
						justifyContent: 'center',
						borderRadius: 3,
						opacity: 0.7
					}}>
						<Text style={{
							alignSelf:'center',
							color:colors.primaryForeground,
							fontSize: fontSizes.button,
						}}>{this.props.title}</Text>
					</View>
				</View>
			)
		}
		return (
			<View>			
				<TouchableOpacity onPress={this.onPress.bind(this)} style={[{
					width: '100%', height: em*81,
					backgroundColor: colors.primaryBackground, 
					justifyContent: 'center',
					borderRadius: 3,
				}, (this.props.disabled)?{opacity: 0.7}:{}]}>
					<Text style={{
						alignSelf:'center',
						color:colors.primaryForeground,
						fontSize: fontSizes.button,
					}}>{this.props.title}</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

export class SecondaryButton extends Component {
	render() {
		const {title, buttonStyle, inputStyle} = this.props
		return (
			<View>
				<TouchableOpacity onPress={this.props.onPress}
				style={[{
					width: this.props.width, height:60*em,
					backgroundColor: colors.secondaryBackground,
					justifyContent: 'center',
					paddingLeft: 24*em, paddingRight: 24*em,
					borderRadius: 3, borderColor: colors.primary, borderWidth: 1,
				}, buttonStyle]}>
					<Text style={[{
						alignSelf:'center',
						color:colors.secondaryForeground,
						fontSize: fontSizes.small,
					}, inputStyle]}>{title}</Text>
				</TouchableOpacity>
			</View>
		)
	}
}