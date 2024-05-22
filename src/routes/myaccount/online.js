import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/online/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-online-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-online-index'
})

export default Router;