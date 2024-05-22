import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/my_company/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-my_company-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-my_company-index'
})

export default Router;