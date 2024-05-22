import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/inquiry/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-inquiry-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-inquiry-index'
})

export default Router;