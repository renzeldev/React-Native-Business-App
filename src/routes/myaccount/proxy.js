import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/proxy/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-proxy-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-proxy-index'
})

export default Router;