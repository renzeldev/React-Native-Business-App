import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/teller/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-teller-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-teller-index'
})

export default Router;