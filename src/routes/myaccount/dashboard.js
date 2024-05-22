import React, {Component} from 'react';

import DashboardScene from '../../pages/myaccount/dashboard';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-dashboard': {
    screen: DashboardScene
  }
}, {
  initialRouteName: 'myaccount-dashboard'
})

export default Router;