import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/commitment/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-commitment-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-commitment-index'
})

export default Router;