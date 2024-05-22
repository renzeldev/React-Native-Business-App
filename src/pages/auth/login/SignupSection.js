import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Dimensions from 'Dimensions';

import {StyleSheet, View, Text} from 'react-native';

export default class SignupSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>人眼识别登录</Text>
        <Text style={styles.text}>新用户注册</Text>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 165,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: '#229af0',
    backgroundColor: 'transparent',
  },
});
