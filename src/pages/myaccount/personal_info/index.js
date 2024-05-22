import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'
import {connnect} from 'react-redux'

import {TopBar} from '../../../commonUI/components/topbar'
import {em, H, colors, fontSize} from '../../../commonUI/base'
import {formStyles, textStyles, actionButtonStyles, fixedFormStyles} from '../../../commonUI/styles'
import {PrimaryButton} from '../../../commonUI/components/buttons'

export default class Scene extends Component {
  static navigationOptions = {
    headerStyle: {
      display: 'none'
    }
  }
  goBack() {
    this.props.navigation.navigate('myaccount-dashboard')
  }
  render() {
    return (
      <View>
        /*
        <TopBar title='个人资料' onBack={this.goBack.bind(this)}/>
        <BasicInfo1/>
        <BasicInfo2/>
        <ProxyInfo/>
        <WorkHistory/>
        <EducationHistory/>
        */
      </View>
    )
  }
}

class BasicInfo1 extends Component {
  render() {
    const {user_name} = this.props.personalInfo
    return (
      <View style={fixedFormStyles.container}>
        <Text style={fixedFormStyles.formTitle}>基本信息</Text>
        <View style={fixedFormStyles.formField}>
          <View style={fixedFormStyles.fieldLabelWrapper}>
            <Text style={fixedFormStyles.fieldLabel}>姓名</Text>
          </View>
          <View style={fixedFormStyles.fieldTextWrapper}>
            <Text style={fixedFormStyles.fieldText}>{user_name}</Text>
          </View>
        </View>
        <View style={fixedFormStyles.formField}>
          <View style={fixedFormStyles.fieldLabelWrapper}>
            <Text style={fixedFormStyles.fieldLabel}>手机号码</Text>
          </View>
          <View style={fixedFormStyles.fieldTextWrapper}>
            <Text style={fixedFormStyles.fieldText}>{user_phone}</Text>
          </View>
        </View>
      </View>
    )
  }
}

class BasicInfo2 extends Component {
  render() {
    return (
      <View>

      </View>
    )
  }
}

class ProxyInfo extends Component {
  render() {
    return (
      <View>

      </View>
    )
  }
}

class WorkHistory extends Component {
  render() {
    return (
      <View>

      </View>
    )
  }
}

class EducationHistory extends Component {
  render() {
    return (
      <View>

      </View>
    )
  }
}