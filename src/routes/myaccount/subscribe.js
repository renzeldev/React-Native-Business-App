import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/subscribe/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-subscribe-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-subscribe-index'
})

export default Router;