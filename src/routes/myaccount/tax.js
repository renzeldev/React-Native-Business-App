import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/tax/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-tax-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-tax-index'
})

export default Router;