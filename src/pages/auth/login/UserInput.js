import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Dimensions from 'Dimensions';

import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';

export default class UserInput extends Component {
  render() {
    return (
      <View style={styles.inputWrapper}>
        <ImageBackground source={this.props.source} style={styles.inlineImg} />
        <TextInput
          style={styles.input}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor = "#312c2c"
        />
      </View>
    );
  }
}

UserInput.propTypes = {
  source: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    width: DEVICE_WIDTH - 60,
    height: 45,
    marginHorizontal: 20,
    paddingLeft: 50,
    borderRadius: 5,
    color: '#000000',
    justifyContent: 'center',
    alignItems:'center',
    borderColor:'#000000',
    borderWidth:1
  },
  inputWrapper: {
    flex: 1,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 20,
    height: 20,
    left: 35,
    top: 12,
  },
});
