import React, {Component} from 'react'
import {StyleSheet, TextInput, Text, View, Image, TouchableOpacity} from 'react-native'
import Picker, {CascadePicker} from 'react-native-picker-xg'
import DatePicker from 'react-native-datepicker'

import {em, W, colors, fontSizes} from  '../base'
import {formStyles, fixedFormStyles} from '../styles'

export class InputSingleTextFormWithImage extends Component {
	onChangeText(field, value) {
		this.props.onChangeText(field, value);
	}	
	render() {
		return (
			<View style = {{flexDirection:'row', marginBottom:20}}>
				<Image source = {this.props.ImageUrl} style={{
					width: 54*em, height: 60*em, marginRight:10,
				}}/>
				<TextInput placeholder = {this.props.placeholder} placeholderTextColor = {this.props.placeholderTextColor} onChangeText = {this.onChangeText.bind(this, this.props.field)}
					style = {{borderBottomWidth: 1, borderBottomColor: '#ccc', width: 300*em, height: 60*em, color:this.props.fontColor}}
					secureTextEntry = {this.props.isSecure} value = {this.props.value}
				/>
			</View>
		)
	}
}

export class InputSingleTextFormWithTitle extends Component {
	onChangeText(field, value) {
		this.props.onChangeText(field, value);
	}	
	render() {
		return (
			<View style = {{flexDirection:'row', marginBottom:20, alignItems:'center'}}>
				{this.props.title ? (
					<Text style = {{fontSize: 20*em, margin:20*em, width:120*em}}>{this.props.title}</Text>
				) : (
					null
				)}
				<TextInput 
					placeholder = {this.props.placeholder} 
					placeholderTextColor = {this.props.placeholderTextColor} 
					onChangeText = {this.onChangeText.bind(this, this.props.field)}
					style = {{ borderBottomWidth: 1, borderBottomColor: '#ccc', width: 300*em, height: 60*em, color:this.props.fontColor, fontSize:20*em}}
					secureTextEntry = {this.props.isSecure} 
					value = {this.props.value}
				/>
			</View>
		)
	}
}

export class InputMultipleTextFormWithTitle extends Component {
	onChangeText(field, value) {
		this.props.onChangeText(field, value);
	}	
	render() {
		return (
			<View style = {{flexDirection:'row'}}>
				{this.props.title? (
					<Text style = {{fontSize: 20*em, margin:20*em, width:120*em}}>{this.props.title}</Text>
				) : (null)}
				<TextInput multiline = {true}  placeholder = {this.props.placeholder} placeholderTextColor = {this.props.placeholderTextColor} onChangeText = {this.onChangeText.bind(this, this.props.field)}
					style = {[{borderWidth: 1, borderColor: '#ccc', width: 300*em, height: 140*em, color:this.props.fontColor, fontSize:20*em}, this.props.style]}
					secureTextEntry = {this.props.isSecure} value = {this.props.value}
					textAlignVertical = "top"
					underlineColorAndroid = 'transparent'
				/>
			</View>
		)
	}
}

export class DateField extends Component {
	onChangeField(fieldValue) {
	  let fieldName = this.props.name;
	  this.props.onChangeField(fieldName, fieldValue);
	}
	render() {
	  return (
			  <View style = {{flexDirection:'row', marginBottom:20}}>
				  <Text style = {{fontSize: 20*em, margin:20*em, width:120*em}}>{this.props.title}</Text>
				  <View style={{width: 300*em, height:60*em, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
					  <DatePicker placeholder={this.props.placeholder} mode='date' format='YYYY-MM-DD' showIcon={false} style={{width: '100%', }} customStyles={{placeholderText: {textAlign: 'left', width: '100%'}, dateText: {textAlign: 'left', marginLeft:20, width: '100%'}, dateInput: {borderWidth: 0}}} onDateChange={this.onChangeField.bind(this)} date={this.props.value}/>
				  </View>
			  </View>
	  )
	}
  }

export class InputField extends Component {
	onChangeField(fieldValue) {
		let fieldName = this.props.name;		
		this.props.onChangeField(fieldName, fieldValue);
	}
	render() {
		const {image} = this.props;
		if (image) {			
			return (
				<InputFieldWithImage name={this.props.name} image={this.props.image} onChangeField={this.props.onChangeField} placeholder={this.props.placeholder} passwordField={this.props.passwordField?true:false}/>
			)
		}
		return (
			<View style={formStyles.formField}>
				<View  style={formStyles.fieldLabelWrapper}>
					<Text style={formStyles.fieldLabel}>
						{this.props.label}
					</Text>
				</View>
				<TextInput placeholder={this.props.placeholder} onChangeText={this.onChangeField.bind(this)} 
				secureTextEntry={this.props.passwordField?true:false}
				style={formStyles.fieldText}/>
			</View>
		)
	}
}

class InputFieldWithImage extends Component {
	onChangeField(fieldValue) {
		let fieldName = this.props.name;
		this.props.onChangeField(fieldName, fieldValue);
	}
	render() {
		return (
			<View style={formStyles.formField}>
				<Image source={this.props.image} style={{
					width: 54*em, height: 54*em,
					margin: 18*em,
				}}/>
				<TextInput placeholder={this.props.placeholder} onChangeText={this.onChangeField.bind(this)}
				style={[formStyles.fieldText, {width: 468*em}]} secureTextEntry={this.props.passwordField?true:false}/>
			</View>
		)
	}
}

export class CheckField extends Component {
	render() {
		let checkedImage = require('../images/checkbox_checked.png')
		const {checked} = this.props
		if (!checked) checkedImage = require('../images/checkbox_unchecked.png')

		return (
			<View style = {{height: 60*em}}>
				<TouchableOpacity onPress={this.props.onChange} 
				style={{flexDirection: 'row'}}   disabled = {this.props.active? false: checked}>
					<Image source={checkedImage} style={[{
						width: 40*em, height: 40*em
					}, this.props.imageStyle]}/>
					<View>
						<Text
						style={[{
							color: colors.text, fontSize: 20*em,						
						}, this.props.textStyle]}>{this.props.label}</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

export class SelectField extends Component {
  onChangeField(fieldText, selectIndex, fieldValue) {
    let fieldName = this.props.name;
    this.props.onChangeField(fieldName, fieldValue);
  }
  render() {
    return (
			<View style={formStyles.formField}>
				<View  style={formStyles.fieldLabelWrapper}>
					<Text style={formStyles.fieldLabel}>
            {this.props.label}
					</Text>
				</View>
				<View style={{
          flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center',
          width: '75%',
          position: 'relative'
        }}>
					<Picker data={this.props.data} iconStyle={{display: 'none'}} inputStyle={{borderWidth: 0, width: '100%', marginLeft: 0, marginRight: 0, alignItems: 'flex-start', textAlign: 'left', width: W*0.75, zIndex: 12, backgroundColor: 'transparent'}} textStyle={[{alignItems: 'flex-start', textAlign: 'left'},(this.props.value=='请选择')?{color: '#9a9a9a'}:{}]} inputValue={this.props.value} pickerName={this.props.pickerName?this.props.pickerName:''} onResult={this.onChangeField.bind(this)}/>
					<Image source={require('../images/注册_图标_导向.png')} style={{width: 24*em*0.8, height: 42*em*0.8, position: 'absolute', right: 10*em, top: 30*em, zIndex: 11}}/>
				</View>
			</View>
    )
  }
}



export class DateBetweenField extends Component {
  onChangeFromField(fieldValue) {
    let fieldName = this.props.fromName;
    this.props.onChangeField(fieldName, fieldValue);
  }
  onChangeToField(fieldValue) {
    let fieldName = this.props.to_name;
    this.props.onChangeField(fieldName, fieldValue);
  }
  render() {
    return (
			<View style={formStyles.formField}>
				<View  style={formStyles.fieldLabelWrapper}>
					<Text style={formStyles.fieldLabel}>
            {this.props.label}
					</Text>
				</View>
				<View style={{
          flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center'
        }}>
					<DatePicker placeholder={this.props.fromPlaceholder} style={{width: 160*em}} mode='date' date={this.props.fromValue} format='YYYY-MM-DD' showIcon={false}
											customStyles={{dateInput: {borderWidth: 0}}} onDateChange={this.onChangeFromField.bind(this)}/>
					<Image source={require('../images/line-horizontal-between.png')} style={{
            marginLeft: 30*em, marginRight: 30*em,
            width: 45*em, height: 15*em,
          }}/>
					<DatePicker placeholder={this.props.toPlaceholder} style={{width: 160*em}} mode='date' date={this.props.toValue} format='YYYY-MM-DD' showIcon={false}
											customStyles={{dateInput: {borderWidth: 0}}} onDateChange={this.onChangeToField.bind(this)}/>
				</View>
			</View>
    )
  }
}

export class TextField extends Component {
  onChangeField(fieldValue) {
    let fieldName = this.props.name;
    this.props.onChangeField(fieldName, fieldValue);
  }
  render() {
    return (
			<View style={fixedFormStyles.formField}>
				<View  style={fixedFormStyles.fieldLabelWrapper}>
					<Text style={fixedFormStyles.fieldLabel}>
            {this.props.label}
					</Text>
				</View>
				<View style={fixedFormStyles.fieldTextWrapper}>
					<Text style={fixedFormStyles.fieldText}>{this.props.value}</Text>
				</View>
			</View>
    )
  }
}