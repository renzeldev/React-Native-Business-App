import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/my_address/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-my_address-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-my_address-index'
})

export default Router;