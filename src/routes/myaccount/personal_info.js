import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/personal_info/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-personal_info-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-personal_info-index'
})

export default Router;