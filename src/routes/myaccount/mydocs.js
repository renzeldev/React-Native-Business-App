import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/mydocs/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-mydocs-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-mydocs-index'
})

export default Router;