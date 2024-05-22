import React, {Component} from 'react';

import axios from 'axios';

import PropTypes from 'prop-types';

import Dimensions from 'Dimensions';

import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
  Alert,
  View, ImageBackground
} from 'react-native';

import {Actions, ActionConst} from 'react-native-router-flux';

import spinner from '../images/loading.gif';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export default class ButtonSubmit extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
    };

    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    if (this.state.isLoading) return;

    const loginData = {
      userName: 'AAAA',
      userPwd: '12345'
    };
    
    /*
    var url = "http://localhost:8088/login";
    axios.post(url, { userName: this.loginData.userName, userPwd: this.loginData.userPwd }).then((x) => {
      alert("Submit success!");
      this.setState({
        userName: "",
        userPwd: ""
      });
      setTimeout(() => {
        Actions.secondScreen();
        this.setState({
          isLoading: false
        });
        this.buttonAnimated.setValue(0);
        this.growAnimated.setValue(0);
      }, 2300);
    }).catch((x) => {
      console.log(x);
      alert("Submit canceled!");
    })
    */

    // this.setState({isLoading: true});
    // Animated.timing(this.buttonAnimated, {
    //   toValue: 1,
    //   duration: 200,
    //   easing: Easing.linear,
    // }).start();

    // setTimeout(() => {
    //   this._onGrow();
    // }, 2000);

    // setTimeout(() => {
    //   Actions.secondScreen();
    //   this.setState({isLoading: false});
    //   this.buttonAnimated.setValue(0);
    //   this.growAnimated.setValue(0);
    // }, 2300);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={{width: changeWidth}}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._onPress}
            activeOpacity={1}>
            {this.state.isLoading ? (
              <ImageBackground source={spinner} style={styles.image} />
            ) : (
              <Text style={styles.text}>登 录</Text>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a7cce',
    height: 48,
    width: DEVICE_WIDTH - 60,
    borderRadius: 5,
    zIndex: 100,
    
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#F035E0',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#F035E0',
  },
  text: {
    color: '#000000',
    backgroundColor: 'transparent',
    fontSize:16
  },
  image: {
    width: 22,
    height: 22,
  },
});
