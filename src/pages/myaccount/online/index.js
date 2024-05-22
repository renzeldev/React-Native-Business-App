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
    this.props.navigation.navigate('myaccount-dashboard');
  }
  render() {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <TopBar title='注册' onBack={this.goBack.bind(this)}/>
        <Text>online Scene</Text>
      </View>
    )
  }
}