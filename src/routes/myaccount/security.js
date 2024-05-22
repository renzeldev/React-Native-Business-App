import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/security/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-security-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-security-index'
})

export default Router;