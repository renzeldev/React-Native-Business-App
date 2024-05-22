import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/official_money/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-official_money-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-official_money-index'
})

export default Router;