import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/welfare/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-welfare-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-welfare-index'
})

export default Router;